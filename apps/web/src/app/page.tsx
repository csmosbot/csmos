import { getRegistry } from "@/registry";

export default async function Home() {
  const registry = await getRegistry();
  console.log(registry);
  return (
    <div className="container py-6">
      <h1>hello world</h1>
    </div>
  );
}
