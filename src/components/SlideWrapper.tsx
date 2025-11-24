import { type ReactNode } from "react";
import {
  PlusIcon,
  MinusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useMyPresence } from "@liveblocks/react";

type SlideWrapperProps = {
  slideNum: number;
  slideId: string;
  onAddSlide: (flag: "above" | "below", slideId: string) => void;
  onDeleteSide: (slideId: string) => void;
  children: ReactNode;
};

const SlideWrapper = ({
  slideNum,
  slideId,
  onAddSlide,
  onDeleteSide,
  children,
}: SlideWrapperProps) => {
  const myPresence = useMyPresence();
  const canEditDeck = myPresence[0].role === "owner";

  return (
    <div className="flex items-start w-full justify-center gap-4">
      <div>
        <h2 className="text-4xl font-bold text-amber-500/60">{slideNum}</h2>
        {/* For Debug */}
        {/* <p className="text-md font-semibold text-amber-500/60">ID: {slideId}</p> */}
      </div>

      {children}

      <div className="grid grid-rows-2 gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="w-8 aspect-square flex justify-center items-center cursor-pointer disabled:cursor-not-allowed font-semibold disabled:text-amber-500/60 text-amber-500 hover:text-amber-700 transition-colors duration-200 ease-in-out"
              onClick={() => onAddSlide("above", slideId)}
              disabled={!canEditDeck}
            >
              <div className="">
                <ChevronUpIcon className="size-6" />
                <PlusIcon className="size-6" />
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Slide Above</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="w-8 aspect-square flex justify-center items-center cursor-pointer disabled:cursor-not-allowed font-semibold disabled:text-amber-500/60 text-amber-500 hover:text-amber-700 transition-colors duration-200 ease-in-out h-full"
              onClick={() => onDeleteSide(slideId)}
              disabled={!canEditDeck}
            >
              <MinusIcon className="size-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Delete Slide</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="w-8 aspect-square flex justify-center items-center cursor-pointer disabled:cursor-not-allowed font-semibold disabled:text-amber-500/60 text-amber-500 hover:text-amber-700 transition-colors duration-200 ease-in-out"
              onClick={() => onAddSlide("below", slideId)}
              disabled={!canEditDeck}
            >
              <div className="">
                <PlusIcon className="size-6" />
                <ChevronDownIcon className="size-6" />
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Slide Below</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default SlideWrapper;
