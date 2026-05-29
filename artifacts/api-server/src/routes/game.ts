import { Router } from "express";
import { db, scoresTable } from "@workspace/db";
import { desc, avg, max, count, sql } from "drizzle-orm";
import { SubmitScoreBody } from "@workspace/api-zod";

const router = Router();

router.post("/game/scores", async (req, res) => {
  const parse = SubmitScoreBody.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const data = parse.data;

  const [score] = await db
    .insert(scoresTable)
    .values({
      playerName: data.playerName,
      totalScore: data.totalScore,
      friendlyScore: data.friendlyScore,
      proficientScore: data.proficientScore,
      dedicatedScore: data.dedicatedScore,
      happinessPercent: data.happinessPercent,
      badge: data.badge,
      avgProcessingSeconds: data.avgProcessingSeconds ?? null,
      paymentErrors: data.paymentErrors,
    })
    .returning();

  res.status(201).json({
    ...score,
    createdAt: score.createdAt.toISOString(),
  });
});

router.get("/game/leaderboard", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const rows = await db
    .select()
    .from(scoresTable)
    .orderBy(desc(scoresTable.totalScore), desc(scoresTable.happinessPercent))
    .limit(limit);

  res.json(
    rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.get("/game/stats", async (req, res) => {
  const [stats] = await db
    .select({
      totalPlays: count(),
      avgScore: avg(scoresTable.totalScore),
      topScore: max(scoresTable.totalScore),
      avgHappiness: avg(scoresTable.happinessPercent),
    })
    .from(scoresTable);

  res.json({
    totalPlays: Number(stats.totalPlays) || 0,
    avgScore: Math.round(Number(stats.avgScore) || 0),
    topScore: Number(stats.topScore) || 0,
    avgHappiness: Math.round(Number(stats.avgHappiness) || 0),
  });
});

export default router;
