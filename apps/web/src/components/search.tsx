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
    })),
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
        <button className="flex h-10 w-48 items-center justify-between rounded-md border border-input px-3 py-2 text-sm text-muted-foreground ring-offset-background transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:w-64">
          <div className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            <p className="inline md:hidden">Search...</p>
            <p className="hidden md:inline">Search docs...</p>
          </div>
          <kbd className="flex items-center gap-1 rounded border bg-muted px-1.5 text-xs">
            <span className="mt-0.5 text-sm">⌘</span> K
          </kbd>
        </button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 shadow-lg">
        <div className="flex items-center border-b pl-3">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            className="flex h-11 w-full rounded-md border-none bg-transparent py-3 pl-0 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search docs..."
            onChange={onChange}
          />
        </div>
        <div className="flex flex-col divide-y [&:empty]:hidden">
          {results?.map((result) => (
            <DialogClose asChild>
              <Link
                key={result.slug}
                href={result.slug}
                className="flex flex-col gap-2 p-4 transition-colors hover:bg-muted"
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
