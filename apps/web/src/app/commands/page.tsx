import { getRegistry } from "@/registry";
import { AllCommands } from "./commands";

export default async function Commands() {
  const registry = await getRegistry();
  return (
    <div className="container py-6">
      <h1 className="text-4xl font-bold tracking-tight">Commands</h1>
      <p className="text-sm text-muted-foreground pt-1">
        View a list of every single one of csmos' commands.
      </p>
      <AllCommands registry={registry} />
    </div>
  );
}
