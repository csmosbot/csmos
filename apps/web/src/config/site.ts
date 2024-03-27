import type { ItemWithHref } from "@/lib/types/item";

interface SiteConfig {
  navbarItems: ItemWithHref[];
}

export const siteConfig: SiteConfig = {
  navbarItems: [
    {
      title: "Docs",
      href: "/docs",
    },
  ],
};
