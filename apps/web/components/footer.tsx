import Image from "next/image";
import Link from "next/link";
import React, { type ReactNode } from "react";

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const classes =
    "text-sm text-neutral-500 no-underline betterhover:hover:text-neutral-700 betterhover:hover:dark:text-white transition";
  if (href.startsWith("http")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

function FooterHeader({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
      {children}
    </h3>
  );
}

const navigation: Record<string, { name: string; href: string }[]> = {
  general: [
    { name: "Documentation", href: "/docs" },
    { name: "About", href: "/about" },
    { name: "Invite", href: "/invite" },
    { name: "Vote", href: "/vote" },
  ],
  support: [
    {
      name: "Discord",
      href: "/discord",
    },
  ],
  company: [
    { name: "GitHub", href: "https://github.com/StatisticalLabs" },
    { name: "Twitter", href: "https://twitter.com/GraphifyStats" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className="" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div>
        <Link
          className="flex items-center justify-center gap-1 hover:opacity-75 md:justify-normal md:w-fit"
          href="/"
        >
          <Image src="/logo.png" alt="csmos logo" width={50} height={50} />
          <h1 className="text-fuchsia-500 text-2xl font-bold tracking-tighter">
            csmos
          </h1>
        </Link>
        <p className="mt-4 text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} Cosmotic Labs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
