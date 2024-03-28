import type { Item } from "@/lib/types/item";

interface DocsConfig {
  sidebarItems: Item[];
}

export const docsConfig: DocsConfig = {
  sidebarItems: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Inviting csmos to your server",
          href: "/docs/invite",
        },
        {
          title: "Commands",
          href: "/docs/commands",
        },
      ],
    },
  ],
};
