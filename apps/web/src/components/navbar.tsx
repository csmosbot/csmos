"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./themes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm container border-b py-2 flex items-center justify-between">
      <nav className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-all"
        >
          <Image src="/csmos.png" alt="csmos Logo" width={40} height={40} />
        </Link>
        {siteConfig.navbarItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "text-[14.5px] hover:underline transition-colors hover:text-foreground/80",
              pathname.startsWith(item.href)
                ? "font-medium"
                : "text-foreground/60"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <div>
        <ThemeToggle />
      </div>
    </header>
  );
}
