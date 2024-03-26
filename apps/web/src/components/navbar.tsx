import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./themes";

export function Navbar() {
  return (
    <nav className="border-b px-4 py-2 flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-all"
      >
        <Image src="/csmos.png" alt="csmos Logo" width={40} height={40} />
      </Link>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
