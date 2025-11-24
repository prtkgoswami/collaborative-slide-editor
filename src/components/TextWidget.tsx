import React, { useEffect, useRef, useState } from "react";
import { type TextWidgetType } from "./Editor";
import type { Tools } from "./Editor";
import useEditorHistory from "@/hooks/useEditorHistory";

type TextWidgetProps = {
  widgetInfo: TextWidgetType;
  isSelected: boolean;
  activeTool: Tools;
  isSlideReadonly: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (update: Partial<TextWidgetType>) => void;
};

const TextWidget = ({
  widgetInfo,
  isSelected,
  activeTool,
  isSlideReadonly = false,
  onSelect,
  onDelete,
  onUpdate,
}: TextWidgetProps) => {
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const [canEdit, setCanEdit] = useState(true);
  const { startBatch, endBatch } = useEditorHistory();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      isSelected &&
      !canEdit &&
      (e.key === "Delete" || e.key === "Backspace")
    ) {
      e.preventDefault();
      onDelete();
    }

    if (canEdit && e.key === "Escape") {
      e.preventDefault();
      setCanEdit(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSlideReadonly) onSelect();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSlideReadonly) setCanEdit(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSlideReadonly) return;

    startBatch();
    onSelect();

    if (activeTool !== "select") return;

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    origin.current = {
      x: widgetInfo.x,
      y: widgetInfo.y,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragStart.current || !origin.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    onUpdate({
      x: origin.current.x + dx,
      y: origin.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    dragStart.current = null;
    origin.current = null;
    endBatch();
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (!isSelected) {
      setCanEdit(false);
    }
  }, [isSelected]);

  return (
    <div
      className={`absolute ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      style={{
        left: widgetInfo.x,
        top: widgetInfo.y,
        width: widgetInfo.width,
        height: widgetInfo.height,
        cursor: activeTool === "select" ? "move" : "text",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <textarea
        className={`w-full h-full resize-none border-none outline=none bg-transparent focus-visible:outline-none text-xl text-gray-900 ${
          activeTool === "select" ? "cursor-default" : "cursor-text"
        }`}
        value={widgetInfo.text}
        placeholder="Enter Text ..."
        autoFocus={canEdit}
        readOnly={!canEdit}
        onChange={(e) => onUpdate({ text: e.target.value })}
        onFocus={startBatch}
        onBlur={() => {
          endBatch();
          setCanEdit(false);
        }}
        onKeyDown={handleKeyDown}
      />
      {/* For Debug */}
      {/* <p className="text-xs text-blue-500">Widget ID: {widgetInfo.id}</p> */}
    </div>
  );
};

export default TextWidget;
