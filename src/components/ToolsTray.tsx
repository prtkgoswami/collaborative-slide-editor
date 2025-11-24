import { type ReactElement } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  HandRaisedIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import type { Tools } from "./Editor";
import useEditorHistory from "@/hooks/useEditorHistory";

type ToolProps = {
  name: string;
  icon: ReactElement;
  onClick: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
};

type ToolsTrayProps = {
  activeWidget: Tools;
  onClick: (widget: Tools) => void;
};

const Tool = ({
  name,
  icon,
  isSelected = false,
  isDisabled = false,
  onClick,
}: ToolProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          className={`border-2 rounded-md w-10 h-10 text-lg flex justify-center items-center cursor-pointer ${
            isSelected
              ? "bg-amber-500 text-gray-800 border-amber-600"
              : "border-gray-300 text-gray-300 hover:bg-gray-50/30 "
          } transition-colors duration-200 ease-in-out disabled:border-gray-300/60 disabled:text-gray-300/60`}
          onClick={onClick}
          disabled={isDisabled}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="capitalize">{name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const ToolsTray = ({ activeWidget, onClick }: ToolsTrayProps) => {
  const { undo, redo, canUndo, canRedo } = useEditorHistory();

  const handleUndo = () => {
    undo();
  };
  const handleRedo = () => {
    redo();
  };

  return (
    <div className="min-w-80 fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-950/90 px-5 p-2 flex gap-4 justify-center items-center rounded-md">
      <Tool
        name="select"
        icon={<HandRaisedIcon className="size-6" />}
        isSelected={activeWidget === "select"}
        onClick={() => {
          onClick("select");
        }}
      />
      <Tool
        name="text"
        icon={<p>T</p>}
        isSelected={activeWidget === "text"}
        onClick={() => {
          onClick("text");
        }}
      />
      <div className="h-8 border border-gray-200/30" />
      <Tool
        name="undo"
        icon={<ArrowUturnLeftIcon className="size-5" />}
        isSelected={false}
        isDisabled={!canUndo()}
        onClick={handleUndo}
      />
      <Tool
        name="redo"
        icon={<ArrowUturnRightIcon className="size-5" />}
        isSelected={false}
        isDisabled={!canRedo()}
        onClick={handleRedo}
      />
    </div>
  );
};

export default ToolsTray;
