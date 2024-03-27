import { DocsSidebar } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ReactNode } from "react";

export default function DocLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
        <ScrollArea className="h-full pr-4 py-4">
          <DocsSidebar />
        </ScrollArea>
      </aside>
      {children}
    </div>
  );
}
