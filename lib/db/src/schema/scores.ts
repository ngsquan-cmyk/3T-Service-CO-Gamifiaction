import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scoresTable = pgTable("scores", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  totalScore: integer("total_score").notNull(),
  friendlyScore: integer("friendly_score").notNull(),
  proficientScore: integer("proficient_score").notNull(),
  dedicatedScore: integer("dedicated_score").notNull(),
  happinessPercent: integer("happiness_percent").notNull(),
  badge: text("badge").notNull(),
  avgProcessingSeconds: integer("avg_processing_seconds"),
  paymentErrors: integer("payment_errors").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScoreSchema = createInsertSchema(scoresTable).omit({ id: true, createdAt: true });
export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Score = typeof scoresTable.$inferSelect;
