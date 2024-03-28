import { getRegistry } from "@/registry";
import { AllCommands } from "./commands";

export const dynamic = "force-static";

export const metadata = {
  title: "Commands",
  description: "View a list of every single one of csmos' commands.",
  openGraph: {
    siteName: "csmos",
    title: "Commands",
    description: "View a list of every single one of csmos' commands.",
    url: "/commands",
  },
  twitter: {
    title: "Commands",
    description: "View a list of every single one of csmos' commands.",
  },
};

export default async function Commands() {
  const registry = await getRegistry();
  return (
    <div className="container py-6">
      <h1 className="text-4xl font-bold tracking-tight">Commands</h1>
      <p className="pt-1 text-sm text-muted-foreground">
        View a list of every single one of csmos' commands.
      </p>
      <AllCommands registry={registry} />
    </div>
  );
}
