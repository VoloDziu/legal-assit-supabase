import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";

interface Props {
  title: string;
  summary: string;
  onClick: () => void;
  active: boolean;
  expanded: boolean;
}

export function ListItem({ title, summary, onClick, active, expanded }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn([
        "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left hover:bg-muted",
        active ? "bg-muted" : "",
      ])}
    >
      <div className="flex-shrink flex-grow overflow-hidden">
        <div className="truncate text-sm font-semibold">{title}</div>
        <div className="line-clamp-2 text-sm text-muted-foreground">
          {summary}
        </div>
      </div>

      {expanded && <ChevronRightIcon className="flex-shrink-0" />}
    </button>
  );
}
