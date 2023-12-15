import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import react from "@astrojs/react";
import { categories } from "./command-categories.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://csmos.space",
  integrations: [
    starlight({
      title: "csmos",
      description:
        "Everything you need to build the Discord server of your dreams, all in one bot. No need to add any more bots.",
      head: [
        {
          tag: "link",
          attrs: {
            href: "/apple-icon-180x180.png",
            rel: "apple-touch-icon",
            sizes: "180x180",
          },
        },
        {
          tag: "link",
          attrs: {
            href: "/android-icon-192x192.png",
            rel: "icon",
            sizes: "192x192",
            type: "image/png",
          },
        },
        {
          tag: "link",
          attrs: {
            href: "/favicon-32x32.png",
            rel: "icon",
            sizes: "32x32",
            type: "image/png",
          },
        },
        {
          tag: "link",
          attrs: {
            href: "/favicon-16x16.png",
            rel: "icon",
            sizes: "16x16",
            type: "image/png",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "theme-color",
            content: "#F600E0",
          },
        },
      ],
      logo: {
        src: "./src/assets/csmos.webp",
        replacesTitle: true,
      },
      favicon: "/favicon.ico",
      social: {
        github: "https://github.com/CosmoticLabs/csmos",
        discord: "https://discord.com/invite/q7WNcPakYh",
      },
      sidebar: [
        {
          label: "Getting Started",
          link: "/docs/getting-started",
        },
        {
          label: "Commands",
          collapsed: true,
          items: [
            {
              label: "Usage",
              link: "/commands",
            },
            ...categories,
          ],
        },
      ],
      editLink: {
        baseUrl: "https://github.com/CosmoticLabs/csmos/edit/main/apps/web",
      },
      customCss: ["./src/tailwind.css"],
      components: {
        Head: "./src/components/Head.astro",
        Header: "./src/components/Header.astro",
        SocialIcons: "./src/components/SocialIcons.astro",
      },
      titleDelimiter: "—",
      lastUpdated: true,
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  markdown: {
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            ariaHidden: true,
            tabIndex: -1,
            class: "heading-link",
          },
        },
      ],
    ],
  },
  vite: {
    ssr: {
      noExternal: ["@radix-ui/*"],
    },
  },
});
