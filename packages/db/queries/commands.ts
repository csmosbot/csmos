import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { commands } from "../schema";

export async function getCommand(id: string) {
  return await db.query.commands.findFirst({
    where: eq(commands.id, id),
  });
}

export async function getCommandByName(name: string, guildId: string) {
  return await db.query.commands.findFirst({
    where: and(eq(commands.name, name), eq(commands.guildId, guildId)),
  });
}

export async function getCommands(guildId: string) {
  return await db.query.commands.findMany({
    where: eq(commands.guildId, guildId),
  });
}

export async function createCommand(data: typeof commands.$inferInsert) {
  return await db.insert(commands).values(data);
}

export async function updateCommand(
  id: string,
  data: Omit<typeof commands.$inferInsert, "id" | "guildId">
) {
  return await db.update(commands).set(data).where(eq(commands.id, id));
}

export async function deleteCommand(id: string) {
  return await db.delete(commands).where(eq(commands.id, id));
}
