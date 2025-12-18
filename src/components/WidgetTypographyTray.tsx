import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  LinkSlashIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@heroicons/react/24/solid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import type { TypoBlock, TypoStyle } from "./Editor";

type Props = {
  selectedTypoBlock: TypoBlock;
  selectedTypoStyles: TypoStyle[];
  isLink?: boolean;
  OnTypoBlockChange: (block: TypoBlock) => void;
  onTypoStyleChange: (styles: TypoStyle[]) => void;
  onLink: (linkHref: string) => void;
  onUnlink: () => void;
};

const WidgetTypographyTray = ({
  selectedTypoBlock,
  selectedTypoStyles,
  isLink,
  OnTypoBlockChange,
  onTypoStyleChange,
  onLink,
  onUnlink,
}: Props) => {
  const selectedStyleSet = new Set(selectedTypoStyles);

  const handleLink = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const linkHref = formData.get("linkHref") as string;
    onLink(linkHref);
  };

  const handleTypoStyleChange = (style: TypoStyle) => {
    const index = selectedTypoStyles.indexOf(style);
    let updatedStyles = [];

    if (index === -1) {
      updatedStyles = [...selectedTypoStyles, style];
    } else {
      updatedStyles = [
        ...selectedTypoStyles.slice(0, index),
        ...selectedTypoStyles.slice(index + 1),
      ];
    }
    onTypoStyleChange(updatedStyles);
  };

  return (
    <div className="absolute w-max h-max rounded-sm left-1/2 -top-15 -translate-x-1/2 flex gap-1.5 justify-center items-center cursor-pointer p-2 bg-gray-800 border border-gray-900/80">
      <Select value={selectedTypoBlock} onValueChange={OnTypoBlockChange}>
        <SelectTrigger className="w-max text-amber-400! border-amber-400">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="end">
          <SelectItem value="h1">H1</SelectItem>
          <SelectItem value="h2">H2</SelectItem>
          <SelectItem value="h3">H3</SelectItem>
          <SelectItem value="h4">H4</SelectItem>
          <SelectItem value="p">P</SelectItem>
        </SelectContent>
      </Select>
      <div className="h-8 border border-amber-400/60" />
      {isLink ? (
        <button
          type="button"
          className="font-mono text-sm w-9 aspect-square select-none rounded-sm cursor-pointer text-amber-500 bg-transparent border border-amber-400 hover:bg-amber-400 hover:text-gray-800 transition-colors duration-200 ease-in-out disabled:bg-amber-400 disabled:text-gray-800 disabled:cursor-default flex justify-center items-center"
          onClick={onUnlink}
        >
          <LinkSlashIcon className="size-5" />
        </button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="font-mono text-sm w-9 aspect-square select-none rounded-sm cursor-pointer text-amber-500 bg-transparent border border-amber-400 hover:bg-amber-400 hover:text-gray-800 transition-colors duration-200 ease-in-out disabled:bg-amber-400 disabled:text-gray-800 disabled:cursor-default flex justify-center items-center"
            >
              <LinkIcon className="size-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            sideOffset={15}
            className="bg-gray-800 w-100"
          >
            <form
              onSubmit={handleLink}
              className="flex flex-row gap-2 items-end"
            >
              <input
                type="text"
                name="linkHref"
                placeholder="Paste Link Here"
                className="w-full px-2 py-1 border-b-2 border-gray-400 text-gray-200 placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-1 w-max whitespace-nowrap rounded-sm cursor-pointer bg-transparent border border-amber-400 text-gray-200 hover:bg-amber-400 hover:border-amber-500 hover:text-gray-800 transition-colors duration-200 ease-in-out"
              >
                Add Link
              </button>
            </form>
          </PopoverContent>
        </Popover>
      )}
      <button
        type="button"
        className={`font-mono text-sm w-9 aspect-square select-none rounded-sm cursor-pointer text-amber-500 bg-transparent border border-amber-400 hover:bg-amber-400 hover:text-gray-800 transition-colors duration-200 ease-in-out ${
          selectedStyleSet.has("b") ? "bg-amber-400! text-gray-800!" : ""
        } flex justify-center items-center`}
        onClick={() => handleTypoStyleChange("b")}
      >
        <BoldIcon className="size-4" />
      </button>
      <button
        type="button"
        className={`font-mono text-sm w-9 aspect-square select-none rounded-sm cursor-pointer text-amber-500 bg-transparent border border-amber-400 hover:bg-amber-400 hover:text-gray-800 transition-colors duration-200 ease-in-out ${
          selectedStyleSet.has("i") ? "bg-amber-400! text-gray-800!" : ""
        } flex justify-center items-center`}
        onClick={() => handleTypoStyleChange("i")}
      >
        <ItalicIcon className="size-4" />
      </button>
      <button
        type="button"
        className={`font-mono text-sm w-9 aspect-square select-none rounded-sm cursor-pointer text-amber-500 bg-transparent border border-amber-400 hover:bg-amber-400 hover:text-gray-800 transition-colors duration-200 ease-in-out ${
          selectedStyleSet.has("u") ? "bg-amber-400! text-gray-800!" : ""
        } flex justify-center items-center`}
        onClick={() => handleTypoStyleChange("u")}
      >
        <UnderlineIcon className="size-4" />
      </button>
      <button
        type="button"
        className={`font-mono text-sm w-9 aspect-square select-none rounded-sm cursor-pointer text-amber-500 bg-transparent border border-amber-400 hover:bg-amber-400 hover:text-gray-800 transition-colors duration-200 ease-in-out ${
          selectedStyleSet.has("s") ? "bg-amber-400! text-gray-800!" : ""
        } flex justify-center items-center`}
        onClick={() => handleTypoStyleChange("s")}
      >
        <StrikethroughIcon className="size-4" />
      </button>
    </div>
  );
};

export default WidgetTypographyTray;
