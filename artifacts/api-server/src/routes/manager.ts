import { Router } from "express";
import { db, scoresTable } from "@workspace/db";
import { desc, avg, max, count, sql, gte } from "drizzle-orm";

const router = Router();

router.get("/manager/overview", async (req, res) => {
  const [stats] = await db
    .select({
      totalPlays: count(),
      avgTotalScore: avg(scoresTable.totalScore),
      avgFriendlyScore: avg(scoresTable.friendlyScore),
      avgProficientScore: avg(scoresTable.proficientScore),
      avgDedicatedScore: avg(scoresTable.dedicatedScore),
      avgHappiness: avg(scoresTable.happinessPercent),
      topScore: max(scoresTable.totalScore),
      avgPaymentErrors: avg(scoresTable.paymentErrors),
    })
    .from(scoresTable);

  const [passData] = await db
    .select({ passing: count() })
    .from(scoresTable)
    .where(gte(scoresTable.totalScore, 70));

  const total = Number(stats.totalPlays) || 0;
  const passing = Number(passData.passing) || 0;

  res.json({
    totalPlays: total,
    avgTotalScore: Math.round(Number(stats.avgTotalScore) || 0),
    avgFriendlyScore: Math.round(Number(stats.avgFriendlyScore) || 0),
    avgProficientScore: Math.round(Number(stats.avgProficientScore) || 0),
    avgDedicatedScore: Math.round(Number(stats.avgDedicatedScore) || 0),
    avgHappiness: Math.round(Number(stats.avgHappiness) || 0),
    topScore: Number(stats.topScore) || 0,
    passRate: total > 0 ? Math.round((passing / total) * 100) : 0,
    avgPaymentErrors: Math.round((Number(stats.avgPaymentErrors) || 0) * 10) / 10,
  });
});

router.get("/manager/module-performance", async (req, res) => {
  const [stats] = await db
    .select({
      friendly: avg(scoresTable.friendlyScore),
      proficient: avg(scoresTable.proficientScore),
      dedicated: avg(scoresTable.dedicatedScore),
    })
    .from(scoresTable);

  res.json({
    friendly: Math.round(Number(stats.friendly) || 0),
    proficient: Math.round(Number(stats.proficient) || 0),
    dedicated: Math.round(Number(stats.dedicated) || 0),
    friendlyMax: 30,
    proficientMax: 40,
    dedicatedMax: 30,
  });
});

router.get("/manager/score-distribution", async (req, res) => {
  const all = await db
    .select({ totalScore: scoresTable.totalScore })
    .from(scoresTable);

  const bands = [
    { band: "0-49", label: "Cần cải thiện", min: 0, max: 49 },
    { band: "50-69", label: "Đang học hỏi", min: 50, max: 69 },
    { band: "70-84", label: "Chuyên nghiệp", min: 70, max: 84 },
    { band: "85-94", label: "Xuất sắc", min: 85, max: 94 },
    { band: "95-100", label: "Hàng đầu", min: 95, max: 100 },
  ];

  res.json(
    bands.map((b) => ({
      band: b.band,
      label: b.label,
      count: all.filter((r) => r.totalScore >= b.min && r.totalScore <= b.max).length,
    }))
  );
});

router.get("/manager/recent-plays", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);

  const rows = await db
    .select()
    .from(scoresTable)
    .orderBy(desc(scoresTable.createdAt))
    .limit(limit);

  res.json(
    rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.get("/manager/badge-breakdown", async (req, res) => {
  const rows = await db
    .select({
      badge: scoresTable.badge,
      count: count(),
    })
    .from(scoresTable)
    .groupBy(scoresTable.badge);

  const badgeOrder: Record<string, number> = {
    "🌟 Ngôi sao trải nghiệm khách hàng": 95,
    "🏆 Đại sứ 3T MM": 85,
    "🥇 Chuyên gia dịch vụ khách hàng": 70,
    "🥈 Thu ngân chuyên nghiệp": 50,
    "🥉 Thu ngân giỏi chuyên môn": 0,
  };

  res.json(
    rows.map((r) => ({
      badge: r.badge,
      count: Number(r.count),
      minScore: badgeOrder[r.badge] ?? 0,
    }))
  );
});

export default router;
