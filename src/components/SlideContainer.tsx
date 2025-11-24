import { useState } from "react";
import Slide from "./Slide";
import { generateRandomId } from "@/utils/number";
import type { SlideType, Tools } from "./Editor";
import { useRoom } from "@liveblocks/react";

type SlideContainerProps = {
  activeTool: Tools;
  slideList: SlideType[];
};

const SlideContainer = ({ activeTool, slideList }: SlideContainerProps) => {
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const room = useRoom();
  const myPresence = room.getPresence();

  const handleAddSlide = (flag: "above" | "below", slideId: string) => {
    if (myPresence.role !== "owner") return;

    const newSlide: SlideType = {
      id: generateRandomId(4),
      widgets: [],
    };
    const targetSlideIndex = slideList.findIndex(({ id }) => id === slideId);
    let before = [],
      after = [];

    room.getStorage().then(({ root }) => {
      const liveRoot = root as any;
      const currentSlides: SlideType[] = liveRoot.get("slides");
      if (flag === "above") {
        before = currentSlides.slice(0, targetSlideIndex);
        after = currentSlides.slice(targetSlideIndex);
      } else {
        before = currentSlides.slice(0, targetSlideIndex + 1);
        after = currentSlides.slice(targetSlideIndex + 1);
      }

      liveRoot.set("slides", [...before, newSlide, ...after]);
    });
  };

  const handleDeleteSlide = (slideId: string) => {
    room.getStorage().then(({ root }) => {
      const liveRoot = root as any;
      const currentSlides: SlideType[] = liveRoot.get("slides");
      const newList = currentSlides.filter(({ id }) => id !== slideId);

      if (newList.length === 0) {
        newList.push({
          id: generateRandomId(4),
          widgets: [],
        });
      }

      liveRoot.set("slides", [...newList]);
    });
  };

  return (
    <div className="flex flex-col gap-20 justify-center pb-12">
      {slideList.map((slide, index) => (
        <Slide
          key={slide.id}
          slideNum={index + 1}
          data={slide}
          onAddSlide={handleAddSlide}
          onDeleteSide={handleDeleteSlide}
          activeTool={activeTool}
          activeWidget={selectedWidgetId}
          onWidgetClick={setSelectedWidgetId}
        />
      ))}
    </div>
  );
};

export default SlideContainer;
