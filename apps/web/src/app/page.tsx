import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import {
  Command,
  Gamepad2,
  Gavel,
  Hand,
  LineChart,
  Music,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container py-6">
      <span className="hero-gradient" />
      <section className="py-20 sm:py-28 md:py-32">
        <h1 className="mx-auto max-w-3xl text-balance text-center text-5xl font-bold tracking-tight lg:text-7xl">
          The{" "}
          <span className="bg-gradient-to-b from-fuchsia-500 to-fuchsia-800 bg-clip-text text-transparent">
            next generation
          </span>{" "}
          of Discord bots
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-balance text-center text-base sm:text-lg">
          Everything you need to build a Discord server at the touch of your
          hand.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href="/docs" className={buttonVariants({ size: "lg" })}>
            Get started
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="0.97em"
              height="1em"
              viewBox="0 0 496 512"
              className="mr-2 h-5 w-5"
            >
              <path
                fill="currentColor"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6m-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3m44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8M97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1m-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7m32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1m-11.4-14.7c-1.6 1-1.6 3.6 0 5.9c1.6 2.3 4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2"
              />
            </svg>
            <p>View on GitHub</p>
          </Link>
        </div>
      </section>
      <section className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-7 sm:pb-32 lg:px-8">
        <h2 className="mb-10 text-balance text-center text-3xl font-bold tracking-tight lg:text-4xl">
          What's included
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          <FeatureCard
            title="Moderation"
            description="See someone that isn't following the rules? Easily warn, mute, kick or ban them."
            icon={Gavel}
          />
          <FeatureCard
            title="Music"
            description="Listen to your favorite songs with your friends in voice chats."
            icon={Music}
          />
          <FeatureCard
            title="Games"
            description="Allow your members to play games when they're bored."
            icon={Gamepad2}
          />
          <FeatureCard
            title="Leveling"
            description="The more your members talk in chat, the more XP they gain."
            icon={LineChart}
          />
          <FeatureCard
            title="Custom commands"
            description="Create your own commands that respond with their own custom content."
            icon={Command}
          />
          <FeatureCard
            title="Welcomer & Leaver"
            description="Welcome or say goodbye to your members whenever they join or leave."
            icon={Hand}
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 [&>svg]:mb-2 [&>svg]:size-10">
          <Icon />
        </div>
        <CardTitle className="pb-1">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
