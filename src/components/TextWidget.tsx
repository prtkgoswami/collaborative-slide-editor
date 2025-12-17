import React, { useEffect, useRef, useState } from "react";
import { type TextWidgetType } from "./Editor";
import type { Tools } from "./Editor";
import useEditorHistory from "@/hooks/useEditorHistory";
import { ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/24/solid";

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const resizeStart = useRef<{ x: number; y: number } | null>(null);
  const initialSize = useRef<{ width: number; height: number } | null>(null);

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
    if (isSlideReadonly) return;

    setCanEdit(true);

    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;

      const pos = el.value.length; // or 0 if you want caret at start
      el.focus();
      el.setSelectionRange(pos, pos);
    });
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

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!resizeStart.current || !initialSize.current) return;

    const dx = e.clientX - resizeStart.current.x;
    const dy = e.clientY - resizeStart.current.y;

    const newWidth = Math.max(50, initialSize.current.width + dx);
    const newHeight = Math.max(30, initialSize.current.height + dy);

    onUpdate({
      width: newWidth,
      height: newHeight,
    });
  };

  const handleResizeMouseUp = () => {
    resizeStart.current = null;
    initialSize.current = null;
    endBatch();

    document.removeEventListener("mousemove", handleResizeMouseMove);
    document.removeEventListener("mouseup", handleResizeMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSlideReadonly) return;

    startBatch();
    onSelect();

    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    initialSize.current = {
      width: widgetInfo.width,
      height: widgetInfo.height,
    };

    document.addEventListener("mousemove", handleResizeMouseMove);
    document.addEventListener("mouseup", handleResizeMouseUp);
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
      {isSelected && !isSlideReadonly && (
        <div
          className="absolute w-6 h-6 bg-blue-500 -right-2 -bottom-2 cursor-nwse-resize text-white rounded-full flex justify-center items-center"
          onMouseDown={handleResizeMouseDown}
        >
          <ArrowsPointingOutIcon className="size-4" />
        </div>
      )}

      {isSelected && !isSlideReadonly && (
        <div
          className="absolute w-6 h-6 bg-red-600 -right-2 -top-2 cursor-pointer text-white rounded-full flex justify-center items-center"
          onClick={onDelete}
        >
          <XMarkIcon className="size-4" />
        </div>
      )}

      <textarea
        ref={textareaRef}
        className={`w-full h-full resize-none border-none outline=none bg-transparent focus-visible:outline-none text-xl text-gray-900 ${
          activeTool === "select" ? "cursor-default" : "cursor-text"
        }`}
        value={widgetInfo.text}
        placeholder="Enter Text ..."
        autoFocus={canEdit}
        readOnly={!canEdit}
        onMouseDown={(e) => {
          if (!canEdit && e.detail === 1) {
            e.preventDefault();
          }
        }}
        onFocus={() => {
          if (canEdit) {
            startBatch();
          }
        }}
        onChange={(e) => onUpdate({ text: e.target.value })}
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
