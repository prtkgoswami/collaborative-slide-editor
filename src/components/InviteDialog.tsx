import { useState, type ChangeEvent } from "react";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "react-toastify";
import { useRoom } from "@liveblocks/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

type InviteMode = "full" | "multiple";

const InviteDialog = ({ slideIds }: { slideIds: string[] }) => {
  const [inviteMode, setInviteMode] = useState<InviteMode>("full");
  const [slidesToShare, setSlidesToShare] = useState("all");
  const [hasError, setHasError] = useState(false);
  const room = useRoom();

  const handleSubmit = async () => {
    if(inviteMode === "multiple" && hasError)
      return;

    const baseUrl = window.location.origin;
    const roomId = room.id;
    let url = `${baseUrl}/join/${roomId}`;

    if (inviteMode === "full" || slidesToShare === "" || slidesToShare === "all") {
      url += `?permissibleSlides=${btoa("all")}`;
    } else {
      const indexList = new Set(
        slidesToShare.split(",").map((idx) => parseInt(idx))
      );
      const slideIdsToShare = slideIds
        .filter((_, i) => indexList.has(i+1));

      console.log("Invite submit", slideIds, slidesToShare.split(","), indexList, slideIdsToShare, btoa(slideIdsToShare.join(',')))

      url += `?permissibleSlides=${btoa(slideIdsToShare.join(","))}`;
    }

    await navigator.clipboard.writeText(url);
    setInviteMode("full");
    setSlidesToShare("all");
    setHasError(false)

    toast("Invite Link Copied", { type: "success" });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSlidesToShare(value);

    if (value === "") return;

    const indices = value.trim().split(",").map(i => parseInt(i));
    const hasInputError = indices.some(i => i < 1 || i > slideIds.length);
    setHasError(hasInputError)
  }

  return (
    <DialogContent showCloseButton={false}>
      <DialogHeader className="flex flex-row justify-between w-full">
        <DialogTitle>Invite Collaborators</DialogTitle>
        <DialogClose onClick={() => {setHasError(false)}}><XMarkIcon className="size-5" /></DialogClose>
      </DialogHeader>

      <div className="flex flex-col items-center gap-3 mt-5">
        <RadioGroup
          className="w-full flex gap-5 justify-center text-xl"
          value={inviteMode}
          onValueChange={(value) => setInviteMode(value as InviteMode)}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="full" id="invite-full" />
            <label htmlFor="invite-full">Full Deck</label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="multiple" id="invite-multiple" />
            <label htmlFor="invite-multiple">Individual Slides</label>
          </div>
        </RadioGroup>

        {inviteMode === "multiple" && (
          <div className="flex flex-col gap-2">
            <input
              className="py-1 px-4 border-b border-gray-400 focus-visible:outline-none focus-visible:border-blue-500 text-center text-xl"
              type="text"
              placeholder="Slide Numbers (1,2,4...)"
              value={slidesToShare}
              onChange={handleInputChange}
            />
            <p className="text-sm text-gray-500 text-center">
              Share individual slides separated by comma(,)
            </p>
            {hasError && <p className="text-sm text-red-600 text-center">
              Slide Numbers should be between 1 and {slideIds.length}
            </p>}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center mt-5">
        <DialogClose asChild disabled={hasError}>
          <button
            className="cursor-pointer px-8 py-2 border-2 transition-colors ease-in-out duration-200 text-lg rounded-sm bg-transparent border-gray-900 hover:bg-gray-800 text-gray-800 hover:text-gray-100 disabled:border-gray-500 disabled:text-gray-500"
            onClick={handleSubmit}
            disabled={hasError}
          >
            Invite
          </button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

export default InviteDialog;
