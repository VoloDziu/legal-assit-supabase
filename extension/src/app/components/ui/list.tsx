import { cn } from "@/lib/utils";

interface Props {
  title: string;
  summary: string;
  onClick: () => void;
  active: boolean;
}

export function ListItem({ title, summary, onClick, active }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn([
        "block w-full rounded-sm px-3 py-2 text-left hover:bg-muted",
        active ? "bg-muted" : "",
      ])}
    >
      <div className="truncate text-sm font-semibold">{title}</div>
      <div className="line-clamp-2 text-sm text-muted-foreground">
        {summary}
      </div>
    </button>
  );
}
