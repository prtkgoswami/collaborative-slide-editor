import { useNavigate } from "react-router-dom";
import Header from "./Header";
import SlideContainer from "./SlideContainer";
import ToolsTray from "./ToolsTray";
import { useState } from "react";
import { useStorage } from "@liveblocks/react";

export type Tools = "select" | "text";

export type TextWidgetType = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
};

export type SlideType = {
  id: string;
  widgets: TextWidgetType[];
};

const Editor = () => {
  const navigate = useNavigate();
  const isConnected = true;
  const [activeTool, setActiveTool] = useState<Tools>("select");
  const slideList = useStorage((root) => (root as any).slides) || [];

  if (!isConnected) {
    navigate("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header isConnected={isConnected} slideIds={slideList.map((slide: SlideType) => slide.id)} />
      <div className="grow py-5 px-4">
        <SlideContainer activeTool={activeTool} slideList={slideList} />
      </div>
      <ToolsTray
        activeWidget={activeTool}
        onClick={(name) => setActiveTool(name)}
      />
    </div>
  );
};

export default Editor;
