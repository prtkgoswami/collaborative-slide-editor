import Editor from "@/components/Editor";
import { useConnection } from "@/context/ConnectionContext";
import { getColor } from "@/utils/color";
import { generateRandomId } from "@/utils/number";
import {
  ClientSideSuspense,
  RoomProvider,
  useRoom,
  useSelf,
  useStorage,
  useUpdateMyPresence,
} from "@liveblocks/react";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type CollabEditorContentProps = {
  slideIds: string;
};

const LoadingConnecion = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center">
        <div className="h-20 w-20 border-4 border-dashed border-amber-500 rounded-full animate-spin"></div>
        <h2 className="text-amber-500 text-4xl">Preparing the Deck...</h2>
      </div>
    </div>
  );
};

const CollabEditorContent = ({ slideIds }: CollabEditorContentProps) => {
  const updateMyPresence = useUpdateMyPresence();
  const { userName } = useConnection();
  const room = useRoom();
  const self = useSelf();
  const roomStatus = room.getStatus();
  const ownerId = useStorage((root) => root.ownerId);
  const slides = useStorage((root) => (root as any).slides);

  useEffect(() => {
    if (!slides || slides.length === 0) {
      room.getStorage().then(({ root }) => {
        const liveRoot = root as any;

        if (!liveRoot.get("slides") || liveRoot.get("slides").length === 0) {
          liveRoot.set("slides", [
            {
              id: generateRandomId(4),
              widgets: [],
            },
          ]);
        }
      });
    }
  }, [slides, room]);

  useEffect(() => {
    if (!ownerId && self?.connectionId !== undefined) {
      room.getStorage().then(({ root }) => {
        if (root.get("ownerId") === null) {
          root.set("ownerId", self.connectionId);
        }
      });
    }
  }, [ownerId, self?.connectionId]);

  useEffect(() => {
    if (!userName || self?.connectionId === null || ownerId === null) return;

    const color = getColor(userName);
    const isOwner = ownerId === self?.connectionId;

    updateMyPresence({
      name: userName,
      role: isOwner ? "owner" : "editor",
      permissibleSlides:
        (slideIds === "all" || slideIds === ""
          ? slideIds
          : slideIds.trim().split(",")) ?? "",
      color,
    });
  }, [userName, updateMyPresence, ownerId]);

  if (roomStatus === "connecting") return <LoadingConnecion />;
  
  return <Editor />;
};

const CollabEditor = () => {
  const { deckId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const slideIds = searchParams.get("permissibleSlides") ?? "";

  if (!deckId) {
    navigate("/");
    return <></>;
  }

  return (
    <RoomProvider
      id={deckId}
      initialStorage={{
        ownerId: null,
        slides: [],
      }}
    >
      <ClientSideSuspense fallback={<LoadingConnecion />}>
        <div className="relative">
          {/* For Debug */}
          {/* <div className="absolute bottom-0 right-0">
            <p className="text-xs font-semibold text-amber-500">
              Deck ID: {deckId}
              <br /> Permissible Slides:{" "}
              {slideIds !== "" ? atob(slideIds) : "NONE"}
            </p>
          </div> */}
          <CollabEditorContent
            slideIds={
              slideIds !== "all" && slideIds !== "" ? atob(slideIds) : slideIds
            }
          />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollabEditor;
