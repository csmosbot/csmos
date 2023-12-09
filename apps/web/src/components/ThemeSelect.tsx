import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "auto" | "dark" | "light";
const key = "starlight-theme";

export default function ThemeSelect() {
  const [theme, setTheme] = useState<Theme>("auto");

  const parseTheme = (theme: unknown): Theme =>
    theme === "auto" || theme === "dark" || theme === "light" ? theme : "auto";

  useEffect(() => {
    const theme =
      typeof localStorage !== "undefined" && localStorage.getItem(key);
    setTheme(parseTheme(theme));
  }, []);

  useEffect(() => {
    (window as any).StarlightThemeProvider.updatePickers(theme);
    document.documentElement.dataset.theme =
      theme === "auto"
        ? matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark"
        : theme;
    if (typeof localStorage !== "undefined") {
      if (theme === "light" || theme === "dark") {
        localStorage.setItem(key, theme);
      } else {
        localStorage.removeItem(key);
      }
    }
  }, [theme]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex cursor-pointer bg-transparent">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        {/* For some reason there's a conflict between eslint's prettier plugin and prettier-plugin-tailwindcss that causes this line to error, so we'll just ignore it */}
        {/* eslint-disable-next-line prettier/prettier */}
        <DropdownMenu.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 mr-8 min-w-[8rem] overflow-hidden rounded-lg bg-[var(--sl-color-bg)] p-2 text-black shadow-md dark:text-white">
          <DropdownMenu.Item
            className="relative flex cursor-pointer select-none items-center gap-1 rounded-lg p-1.5 text-sm outline-none hover:bg-fuchsia-500/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => setTheme("light")}
          >
            <Sun width={20} height={20} /> Light
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="relative flex cursor-pointer select-none items-center gap-1 rounded-lg p-1.5 text-sm outline-none hover:bg-fuchsia-500/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => setTheme("dark")}
          >
            <Moon width={20} height={20} /> Dark
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="relative flex cursor-pointer select-none items-center gap-1 rounded-lg p-1.5 text-sm outline-none hover:bg-fuchsia-500/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => setTheme("auto")}
          >
            <Laptop width={20} height={20} /> System
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
