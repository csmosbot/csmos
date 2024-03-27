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
      if (
        ev.key === "/" &&
        document.activeElement?.tagName.toLowerCase() !== "input"
      )
        setOpen(true);
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
          <div className="border px-1.5 py-0.5 text-xs bg-muted rounded">/</div>
        </button>
      </DialogTrigger>
      <DialogContent disableXIcon>
        <Input placeholder="Search docs..." onChange={onChange} />
        <div className="[&:empty]:hidden flex flex-col gap-3">
          {results?.map((result) => (
            <DialogClose asChild>
              <Link
                key={result.slug}
                href={result.slug}
                className="flex flex-col gap-2 border p-4 rounded-lg hover:bg-muted transition-colors"
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
