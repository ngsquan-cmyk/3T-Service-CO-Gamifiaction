import { Router } from "express";
import { db, settingsTable, scoresTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

async function ensureSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length === 0) {
    const [created] = await db.insert(settingsTable).values({}).returning();
    return created;
  }
  return rows[0];
}

router.get("/manager/settings", async (req, res) => {
  const settings = await ensureSettings();
  res.json(settings);
});

router.put("/manager/settings", async (req, res) => {
  const settings = await ensureSettings();
  const {
    storeName,
    passingScore,
    quickChallengeTimer,
    activeModules,
    customMessages,
    showLeaderboardOnHome,
    maxLeaderboardEntries,
  } = req.body;

  const update: Partial<typeof settingsTable.$inferInsert> = {};
  if (storeName !== undefined) update.storeName = String(storeName);
  if (passingScore !== undefined) update.passingScore = Number(passingScore);
  if (quickChallengeTimer !== undefined) update.quickChallengeTimer = Number(quickChallengeTimer);
  if (activeModules !== undefined) update.activeModules = String(activeModules);
  if (customMessages !== undefined) update.customMessages = String(customMessages);
  if (showLeaderboardOnHome !== undefined) update.showLeaderboardOnHome = Boolean(showLeaderboardOnHome);
  if (maxLeaderboardEntries !== undefined) update.maxLeaderboardEntries = Number(maxLeaderboardEntries);

  const [updated] = await db
    .update(settingsTable)
    .set(update)
    .where(eq(settingsTable.id, settings.id))
    .returning();

  res.json(updated);
});

router.post("/manager/reset-scores", async (req, res) => {
  const all = await db.select({ id: scoresTable.id }).from(scoresTable);
  await db.delete(scoresTable);
  res.json({ deleted: all.length });
});

export default router;
