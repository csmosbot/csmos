import Image from "next/image";
import Link from "next/link";
import React from "react";

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
