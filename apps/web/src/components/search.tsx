import { Search as SearchIcon } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

export default function Search() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (
        ev.key === "/" &&
        document.activeElement?.tagName.toLowerCase() !== "input"
      )
        setOpen(true);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-md border border-input px-3 py-2 h-10 flex items-center justify-between gap-6 text-sm text-muted-foreground hover:bg-muted transition-colors hover:text-foreground focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none ring-offset-background">
          <div className="flex items-center gap-2">
            <SearchIcon className="w-4 h-4" />
            <p>Search</p>
          </div>
          <div className="border px-1.5 py-0.5 text-xs bg-muted rounded">/</div>
        </button>
      </DialogTrigger>
      <DialogContent disableXIcon>
        <Input placeholder="Search docs..." />
      </DialogContent>
    </Dialog>
  );
}
