import { LiveObject } from "@liveblocks/client";

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

declare global {
  interface Liveblocks {
    // Storage type
    Storage: {
        ownerId: string | null;
        slides: SlideType[];
    };
    Presence: {
      name: string;
      color: string;
      role: "owner" | "editor";
      permissibleSlides: "all" | string[];
      cursor: { x: number; y: number } | null;
      activeSlideId: string | null;
    };
  }
}

export {};
