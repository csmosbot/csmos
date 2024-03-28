"use client";

import { docsConfig } from "@/config/docs";
import type { ItemWithHref } from "@/lib/types/item";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <div className="w-full">
      {docsConfig.sidebarItems.map((item, index) => (
        <div key={index} className="pb-4">
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
            {item.title}
          </h4>
          {"items" in item && (
            <DocsSidebarItems
              items={item.items as ItemWithHref[]}
              pathname={pathname}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function DocsSidebarItems({
  items,
  pathname,
}: {
  items: ItemWithHref[];
  pathname: string;
}) {
  return (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "px-2 py-1 hover:underline",
            pathname === item.href
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
