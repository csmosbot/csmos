import { Mdx } from "@/components/mdx";
import { TableOfContents } from "@/components/toc";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTableOfContents } from "@/lib/toc";
import { allDocs } from "contentlayer/generated";
import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = getDocFromParams({ params });
  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      siteName: "csmos",
      title: doc.title,
      description: doc.description,
      type: "article",
      url: `/${doc.slug}`,
    },
    twitter: {
      title: doc.title,
      description: doc.description,
    },
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = getDocFromParams({ params });
  if (!doc) return notFound();

  const toc = await getTableOfContents(doc.body.raw);

  return (
    <div className="relative lg:gap-10 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0 pt-6">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          {doc.title}
        </h1>
        <article className="pb-12 pt-8">
          <Mdx code={doc.body.code} />
        </article>
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-14 -mt-2 border-l pl-6 pt-4">
          <ScrollArea className="pb-10">
            <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
              <TableOfContents toc={toc} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
