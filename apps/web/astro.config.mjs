import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "csmos",
      logo: {
        src: "./src/assets/csmos.png",
        replacesTitle: true,
      },
      favicon: "/favicon.ico",
      social: {
        github: "https://github.com/CosmoticLabs/csmos",
      },
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      editLink: {
        baseUrl: "https://github.com/CosmoticLabs/csmos/edit/main/apps/web",
      },
      customCss: ["./src/tailwind.css"],
      components: {
        Head: "./src/components/Head.astro",
        Header: "./src/components/Header.astro",
      },
      titleDelimiter: "—",
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
