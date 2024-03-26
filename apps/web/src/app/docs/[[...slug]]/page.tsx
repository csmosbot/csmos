import { Mdx } from "@/components/mdx";
import { DocsSidebar } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allDocs } from "contentlayer/generated";
import { notFound } from "next/navigation";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join("/") ?? "";
  const doc = allDocs.find((doc) => doc.slugAsParams === slug);
  if (!doc) return null;
  return doc;
}

export const generateStaticParams = async (): Promise<
  DocPageProps["params"][]
> =>
  allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }));

export default function DocPage({ params }: DocPageProps) {
  const doc = getDocFromParams({ params });
  if (!doc) return notFound();
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
        <ScrollArea className="h-full pr-4 py-4">
          <DocsSidebar />
        </ScrollArea>
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            {doc.title}
          </h1>
          <div className="pb-12 pt-8">
            <Mdx code={doc.body.code} />
          </div>
        </div>
      </main>
    </div>
  );
}
