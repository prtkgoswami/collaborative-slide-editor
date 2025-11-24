import { useHistory, useRoom } from "@liveblocks/react";
import { useCallback, useEffect } from "react";

type HistoryHookResponse = {
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  startBatch: () => void;
  endBatch: () => void;
};

const useEditorHistory = (): HistoryHookResponse => {
  const { undo, redo, canUndo, canRedo } = useHistory();
  const room = useRoom();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const startBatch = useCallback(() => {
    room.history.pause()
  }, [room])

  const endBatch = useCallback(() => {
    room.history.resume();
  }, [room])

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    startBatch,
    endBatch
  };
};

export default useEditorHistory;
