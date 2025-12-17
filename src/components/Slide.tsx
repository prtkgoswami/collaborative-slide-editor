import { useRef } from "react";
import type { Tools } from "./Editor";
import { type TextWidgetType, type SlideType } from "./Editor";
import SlideWrapper from "./SlideWrapper";
import { generateRandomId } from "@/utils/number";
import TextWidget from "./TextWidget";
import { useOthers, useRoom, useUpdateMyPresence } from "@liveblocks/react";

type SlideProps = {
  slideNum: number;
  data: SlideType;
  onAddSlide: (flag: "above" | "below", slideId: string) => void;
  onDeleteSide: (slideId: string) => void;
  activeTool: Tools;
  activeWidget: string | null;
  onWidgetClick: (id: string | null) => void;
};

const Slide = ({
  slideNum,
  data,
  onAddSlide,
  onDeleteSide,
  activeTool,
  activeWidget,
  onWidgetClick,
}: SlideProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const widgets = data.widgets;
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();
  const room = useRoom();
  const myPresence = room.getPresence();
  const slideId = data.id;
  const permissibleSlides =
    (myPresence.permissibleSlides as string[] | "all") ?? [];
  const isReadonly =
    permissibleSlides === "all"
      ? false
      : permissibleSlides.length === 0 || !permissibleSlides.includes(slideId);

  const handleSlideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Slide Click", slideId, isReadonly);
    if (isReadonly) return;

    onWidgetClick(null);
    if (activeTool !== "text") return;

    if (!slideRef.current) return;

    const rect = slideRef.current.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;

    const newWidget: TextWidgetType = {
      id: generateRandomId(5),
      x: posX,
      y: posY,
      width: 250,
      height: 120,
      text: "",
    };

    room.getStorage().then(({ root }) => {
      const liveRoot = root as any;
      const slides: SlideType[] = liveRoot.get("slides");

      const updatedSlides = slides.map((slide) => {
        if (slide.id !== slideId) return slide;

        const updatedWidgets = [...slide.widgets, newWidget];

        return { ...slide, widgets: updatedWidgets };
      });
      console.log("Updated Slides", updatedSlides);

      liveRoot.set("slides", updatedSlides);
    });
    onWidgetClick(newWidget.id);
  };

  const handleDeleteWidget = (widgetId: string) => {
    console.log("Widget Delete", slideId, isReadonly, widgetId);
    if (isReadonly) return;

    room.getStorage().then(({ root }) => {
      const liveRoot = root as any;
      const slides: SlideType[] = liveRoot.get("slides");

      const updatedSlides = slides.map((slide) => {
        if (slide.id !== slideId) return slide;

        const updatedWidgets = slide.widgets.filter((w) => w.id !== widgetId);

        return { ...slide, widgets: updatedWidgets };
      });
      console.log("Updated Slides", updatedSlides);

      liveRoot.set("slides", updatedSlides);
    });
    onWidgetClick(null);
  };

  const handleWidgetUpdate = (
    widgetId: string,
    update: Partial<TextWidgetType>
  ) => {
    console.log("Widget Update", slideId, isReadonly, widgetId, update);
    if (isReadonly) return;

    room.getStorage().then(({ root }) => {
      const liveRoot = root as any;
      const slides: SlideType[] = liveRoot.get("slides");

      const updatedSlides = slides.map((slide) => {
        if (slide.id !== slideId) return slide;

        const updatedWidgets = slide.widgets.map((w) =>
          w.id === widgetId ? { ...w, ...update } : w
        );

        return { ...slide, widgets: updatedWidgets };
      });
      console.log("Updated Slides", updatedSlides);

      liveRoot.set("slides", updatedSlides);
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!slideRef.current) return;

    const rect = slideRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateMyPresence({
      cursor: { x, y },
      activeSlideId: slideId,
    });
  };

  const handleMouseLeave = () => {
    updateMyPresence({
      cursor: null,
      activeSlideId: null,
    });
  };

  return (
    <SlideWrapper
      slideNum={slideNum}
      slideId={slideId}
      onAddSlide={onAddSlide}
      onDeleteSide={onDeleteSide}
    >
      <div
        ref={slideRef}
        className="flex justify-center items-center bg-gray-50 text-4xl text-amber-600 aspect-video w-4/5 shadow-xl shadow-amber-500/40 relative"
        onClick={handleSlideClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {widgets.map((widgetData) => (
          <TextWidget
            key={widgetData.id}
            widgetInfo={widgetData}
            isSelected={activeWidget === widgetData.id}
            activeTool={activeTool}
            isSlideReadonly={isReadonly}
            onUpdate={(updates: Partial<TextWidgetType>) =>
              handleWidgetUpdate(widgetData.id, updates)
            }
            onDelete={() => handleDeleteWidget(widgetData.id)}
            onSelect={() => onWidgetClick(widgetData.id)}
          />
        ))}
        {others.map((user) => {
          const presence = user.presence as any;
          if (!presence) return null;

          const { cursor, activeSlideId, color, name } = presence;
          if (!cursor || activeSlideId !== slideId) return null;

          return (
            <div
              key={user.connectionId}
              className="pointer-events-none absolute"
              style={{ left: cursor.x, top: cursor.y }}
            >
              <div
                className="w-2 h-2 rounded-full shadow"
                style={{ backgroundColor: color || "#000" }}
              />
              <div className="text-xs bg-white px-1 py-0.5 rounded shadow mt-1">
                {name || "User"}
              </div>
            </div>
          );
        })}
        {isReadonly && (
          <h2 className="text-amber-500/70 text-3xl font-bold uppercase absolute top-0 left-1/2 -translate-x-1/2 z-100 select-none">
            readonly
          </h2>
        )}
      </div>
    </SlideWrapper>
  );
};

export default Slide;
