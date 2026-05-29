import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").notNull().default("MM Mega Market"),
  passingScore: integer("passing_score").notNull().default(70),
  quickChallengeTimer: integer("quick_challenge_timer").notNull().default(15),
  activeModules: text("active_modules").notNull().default("1,2,3,4,5,6"),
  customMessages: text("custom_messages").notNull().default(""),
  showLeaderboardOnHome: boolean("show_leaderboard_on_home").notNull().default(true),
  maxLeaderboardEntries: integer("max_leaderboard_entries").notNull().default(10),
});

export type Settings = typeof settingsTable.$inferSelect;
