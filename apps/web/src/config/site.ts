import type { ItemWithHref } from "@/lib/types/item";

interface SiteConfig {
  links: {
    invite: string;
    github: string;
  };
  license: {
    name: string;
    href: string;
  };
  navbarItems: ItemWithHref[];
}

export const siteConfig: SiteConfig = {
  links: {
    invite: "/invite",
    github: "https://github.com/csmosbot/csmos",
  },
  license: {
    name: "MIT",
    href: " https://github.com/csmosbot/csmos/blob/main/LICENSE",
  },
  navbarItems: [
    {
      title: "Docs",
      href: "/docs",
    },
    {
      title: "Commands",
      href: "/commands",
    },
  ],
};
