import type { ItemWithHref } from "@/lib/types/item";

interface SiteConfig {
  links: {
    invite: string;
    github: string;
  };
  navbarItems: ItemWithHref[];
}

export const siteConfig: SiteConfig = {
  links: {
    invite: "/invite",
    github: "https://github.com/csmosbot/csmos",
  },
  navbarItems: [
    {
      title: "Docs",
      href: "/docs",
    },
  ],
};
