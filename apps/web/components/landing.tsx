import * as Tooltip from "@radix-ui/react-tooltip";
import Image from "next/image";

export default function Landing() {
  return (
    <div className="max-w-[90rem] mx-auto p-6 min-h-[calc(100vh-var(--nextra-navbar-height))] flex w-full flex-col">
      <div className="flex flex-col md:flex-row gap-4 grow">
        <div className="flex flex-col text-center md:text-left items-center md:items-start justify-center gap-2">
          <h1 className="text-5xl font-bold [text-wrap:balance] tracking-tighter">
            Meet the{" "}
            <span className="relative whitespace-nowrap bg-gradient-to-b from-fuchsia-500 to-fuchsia-800 bg-clip-text text-transparent">
              only Discord bot
              <SquigglyLines />
            </span>{" "}
            you need.
          </h1>
          <p className="text-neutral-500 [text-wrap:pretty]">
            csmos is a multipurpose Discord bot that makes every other Discord
            bot seem useless.
          </p>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span tabIndex={0}>
                  <button className="bg-gradient-to-b from-fuchsia-600 to-fuchsia-800 px-3 py-1 rounded-md opacity-50 cursor-not-allowed pointer-events-none">
                    Add csmos to your Discord server
                  </button>
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="z-50 overflow-hidden rounded-md bg-neutral-900 px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-[var(--radix-tooltip-trigger-width)] text-center mt-1"
                  side="bottom"
                >
                  csmos is still in its development stage, so you cannot invite
                  it right now.
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-1 grow">
          <div className="animate-vert-move rounded-full bg-neutral-100 dark:bg-neutral-800">
            <Image
              src="/logo.png"
              alt="csmos logo"
              width={350}
              height={350}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SquigglyLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 418 42"
      className="absolute top-2/3 left-0 h-[0.48em] w-full fill-fuchsia-500/60"
      preserveAspectRatio="none"
    >
      <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
    </svg>
  );
}
