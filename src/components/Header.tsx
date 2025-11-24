import InviteDialog from "./InviteDialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { UsersIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { useMyPresence, useOthers } from "@liveblocks/react";
import { useConnection } from "@/context/ConnectionContext";

type UserProps = {
  name: string;
  color?: string;
  isSelf?: boolean;
};

type HeaderProps = {
  isConnected: boolean;
  slideIds: string[];
}

const User = ({ name = "Guest", isSelf = false }: UserProps) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return (
    <div className="flex gap-4 items-center">
      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 text-xs font-semibold flex justify-center items-center uppercase">
        {initials}
      </div>
      <p className="text-lg capitalize">
        {name} {isSelf ? " (You)" : ""}
      </p>
    </div>
  );
};

const Header = ({ isConnected, slideIds }: HeaderProps) => {
  const others = useOthers();
  const connectUserCount = others.length + 1;
  const { userName } = useConnection();
  const myPresence = useMyPresence();
  const canInvite = myPresence[0].role === "owner";

  return (
    <header className="w-full flex justify-between items-center pt-5 pb-5">
      <h1 className="text-2xl font-semibold uppercase text-gray-50">
        Slide Editor
      </h1>
      <div className="flex gap-5">
        {isConnected && (
          <Dialog>
            <DialogTrigger disabled={!canInvite} asChild>
              <button
                className="text-lg py-1 px-6 rounded-md border-2 border-gray-300 text-gray-200 hover:bg-white hover:text-gray-800 disabled:border-gray-500 disabled:text-gray-500 transition-colors duration-200 ease-in-out cursor-pointer disabled:cursor-not-allowed"
                disabled={!canInvite}
              >
                Invite
              </button>
            </DialogTrigger>
            <InviteDialog slideIds={slideIds} />
          </Dialog>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <button className="h-10 p-2 flex items-center rounded-md border-2 text-gray-200 border-gray-300 hover:bg-white hover:text-gray-800 duration-200 transition-colors ease-in-out cursor-pointer gap-2">
              <UsersIcon className="size-4" />{" "}
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />{" "}
                <p>{connectUserCount}</p>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="max-h-120 overflow-y-auto flex flex-col gap-2">
            <User name={userName} isSelf={true} />
            {others.map((user) => (
              <User key={user.id} name={user.presence.name as string} />
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
