import { Search as SearchIcon } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { type ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { createIndex, searchIndex } from "@/lib/search";
import { allDocs } from "contentlayer/generated";
import Link from "next/link";
import { DialogClose } from "@radix-ui/react-dialog";

export default function Search() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<
    {
      slug: string;
      title: string;
      content: string[];
    }[]
  >();

  // TODO: add commands
  createIndex(
    allDocs.map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      content: doc.body.raw,
    }))
  );

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "k" && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setResults([]);
  }, [open]);

  function onChange(ev: ChangeEvent<HTMLInputElement>) {
    if (ev.target.value === "/") ev.target.value = "";
    setResults(searchIndex(ev.target.value));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-md border border-input px-3 py-2 h-10 flex items-center justify-between gap-6 text-sm text-muted-foreground hover:bg-muted transition-colors hover:text-foreground focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none ring-offset-background">
          <div className="flex items-center gap-2">
            <SearchIcon className="w-4 h-4" />
            <p>Search</p>
          </div>
          <kbd className="border px-1.5 text-xs bg-muted rounded flex items-center gap-1">
            <span className="text-sm mt-0.5">⌘</span> K
          </kbd>
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 shadow-lg gap-0">
        <div className="flex items-center border-b pl-3">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 border-none pl-0 focus-visible:ring-offset-0"
            placeholder="Search docs..."
            onChange={onChange}
          />
        </div>
        <div className="[&:empty]:hidden flex flex-col divide-y">
          {results?.map((result) => (
            <DialogClose asChild>
              <Link
                key={result.slug}
                href={result.slug}
                className="flex flex-col gap-2 p-4 hover:bg-muted transition-colors"
              >
                <h1
                  className="text-xl font-bold tracking-tight"
                  dangerouslySetInnerHTML={{ __html: result.title }}
                />
                {result.content.map((content) => (
                  <p dangerouslySetInnerHTML={{ __html: content }} />
                ))}
              </Link>
            </DialogClose>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
