import Image from "next/image";
import { useRouter } from "next/router";
import { DocsThemeConfig } from "nextra-theme-docs";
import React from "react";
import Footer from "./components/footer";

const config: DocsThemeConfig = {
  logo: <Image src="/logo.png" alt="csmos logo" width={40} height={40} />,
  project: {
    link: "https://github.com/CosmoticLabs/csmos",
  },
  // chat: {
  //   link: "https://discord.com",
  // },
  docsRepositoryBase: "https://github.com/CosmoticLabs/csmos-website/edit/main",
  editLink: {
    text: "Edit this page on GitHub →",
  },
  feedback: {
    content: "Question? Give us feedback →",
    labels: "feedback",
  },
  footer: {
    text: <Footer />,
  },
  useNextSeoProps: () => {
    return {
      titleTemplate: "%s — csmos",
      additionalLinkTags: [
        {
          href: "/apple-icon-180x180.png",
          rel: "apple-touch-icon",
          sizes: "180x180",
        },
        {
          href: "/android-icon-192x192.png",
          rel: "icon",
          sizes: "192x192",
          type: "image/png",
        },
        {
          href: "/favicon-32x32.png",
          rel: "icon",
          sizes: "32x32",
          type: "image/png",
        },
        {
          href: "/favicon-16x16.png",
          rel: "icon",
          sizes: "16x16",
          type: "image/png",
        },
      ],
    };
  },
  head: function useHead() {
    const socialCard = "https://csmos.vercel.app/og.jpg";

    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#F600E0" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content="The only Discord bot you need." />
        <meta name="og:description" content="The only Discord bot you need." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={socialCard} />
        <meta name="twitter:site:domain" content="csmos.vercel.app" />
        <meta name="twitter:url" content="https://csmos.vercel.app" />
        <meta name="og:image" content={socialCard} />
        <meta name="apple-mobile-web-app-title" content="csmos" />
      </>
    );
  },
  primaryHue: 291,
};

export default config;
