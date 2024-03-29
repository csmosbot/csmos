import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const guilds = pgTable("guilds", {
  id: text("id").primaryKey().notNull(),
  defaultVolume: integer("default_volume").notNull().default(50),
  nowPlayingMessage: text("now_playing_message"),
});

export const guildsRelations = relations(guilds, ({ many }) => ({
  users: many(users),
}));

export type Guild = typeof guilds.$inferSelect;

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  guildId: text("guild_id").notNull(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(0),
  messages: integer("messages").notNull().default(0),
  characters: integer("characters").notNull().default(0),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  guild: one(guilds, {
    fields: [users.guildId],
    references: [guilds.id],
  }),
  warnings: many(warnings),
}));

export type User = typeof users.$inferSelect;

export const warnings = pgTable("warnings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id").notNull(),
  moderatorId: text("moderator_id")
    .notNull()
    .references(() => users.id),
  guildId: text("guild_id")
    .notNull()
    .references(() => guilds.id),
  reason: text("reason").default("No reason specified."),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const warningsRelations = relations(warnings, ({ one }) => ({
  user: one(users, {
    fields: [warnings.userId],
    references: [users.id],
  }),
}));

export type Warning = typeof warnings.$inferSelect;

export const afks = pgTable("afks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  guildId: text("guild_id")
    .notNull()
    .references(() => guilds.id),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const welcomers = pgTable("welcomers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  guildId: text("guild_id")
    .notNull()
    .references(() => guilds.id),
  channelId: text("channel_id").notNull(),
  message: varchar("message", { length: 2000 }).notNull(),
});

export const leavers = pgTable("leavers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  guildId: text("guild_id")
    .notNull()
    .references(() => guilds.id),
  channelId: text("channel_id").notNull(),
  message: varchar("message", { length: 2000 }).notNull(),
});

export const commands = pgTable(
  "commands",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    guildId: text("guild_id")
      .notNull()
      .references(() => guilds.id),
    name: varchar("name", { length: 32 }).unique().notNull(),
    description: varchar("description", { length: 100 }).notNull(),
    response: text("response").notNull(),
  },
  (table) => ({
    nameGuildIdIdx: uniqueIndex("unique_name_guild_id_idx").on(
      table.name,
      table.guildId
    ),
  })
);

export const reactionRoles = pgTable(
  "reaction_roles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    guildId: text("guild_id")
      .notNull()
      .references(() => guilds.id),
    channelId: text("channel_id").notNull(),
    messageId: text("message_id").notNull(),
    emoji: text("emoji").notNull(),
    roleId: text("role_id").notNull(),
  },
  (table) => ({
    uniqueEmojiForRoleInMessage: uniqueIndex(
      "unique_emoji_role_id_message_id_idx"
    ).on(table.messageId, table.emoji, table.roleId),
  })
);
