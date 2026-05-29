import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Users, TrendingUp, CheckCircle2, Smile, ArrowLeft, Award, Clock, BarChart3 
} from "lucide-react";
import { 
  useGetManagerOverview, 
  useGetModulePerformance, 
  useGetScoreDistribution, 
  useGetRecentPlays, 
  useGetBadgeBreakdown,
  getGetRecentPlaysQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMinutes < 1) return "Vừa xong";
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

function getScoreColor(score: number) {
  if (score >= 85) return "bg-green-100 text-green-800 border-green-300";
  if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-300";
  if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-red-100 text-red-800 border-red-300";
}

function getHappinessColor(percent: number) {
  if (percent >= 80) return "text-green-600";
  if (percent >= 50) return "text-yellow-600";
  return "text-red-600";
}

export default function ManagerDashboard() {
  const { data: overview, isLoading: loadingOverview } = useGetManagerOverview();
  const { data: modulePerf, isLoading: loadingModule } = useGetModulePerformance();
  const { data: dist, isLoading: loadingDist } = useGetScoreDistribution();
  const { data: badges, isLoading: loadingBadges } = useGetBadgeBreakdown();
  
  const recentParams = { limit: 20 };
  const { data: recent, isLoading: loadingRecent } = useGetRecentPlays(recentParams, {
    query: { queryKey: getGetRecentPlaysQueryKey(recentParams) }
  });

  const isLoading = loadingOverview || loadingModule || loadingDist || loadingBadges || loadingRecent;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (overview && overview.totalPlays === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Chưa có dữ liệu</h2>
          <p className="text-slate-500">Chưa có dữ liệu thống kê. Mời nhân viên bắt đầu luyện tập để xem báo cáo!</p>
          <Link href="/">
            <Button className="w-full">
              Về Trang Chủ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate weakest category
  const categories = modulePerf ? [
    { name: "Thân thiện", pct: (modulePerf.friendly / modulePerf.friendlyMax) * 100 },
    { name: "Thành thạo", pct: (modulePerf.proficient / modulePerf.proficientMax) * 100 },
    { name: "Tận tâm", pct: (modulePerf.dedicated / modulePerf.dedicatedMax) * 100 }
  ] : [];
  
  const weakestCat = categories.length > 0 ? categories.reduce((min, c) => c.pct < min.pct ? c : min, categories[0]) : null;

  const bandColors: Record<string, string> = {
    "Cần cải thiện": "bg-red-500",
    "Đang học hỏi": "bg-orange-500",
    "Chuyên nghiệp": "bg-yellow-500",
    "Xuất sắc": "bg-blue-500",
    "Hàng đầu": "bg-green-500"
  };

  const totalDistCount = dist ? dist.reduce((acc, d) => acc + d.count, 0) : 0;

  return (
    <div className="min-h-[100dvh] bg-slate-50 pb-12">
      <header className="bg-[#003087] text-white py-6 px-4 md:px-8 mb-8 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Back to home">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Bảng Điều Khiển Quản Lý</h1>
            <p className="text-blue-100 text-sm mt-1">MM Mega Market — Phân tích đào tạo 3T</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        {/* Section 1 - KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Tổng lượt chơi</p>
                <h3 className="text-2xl font-bold text-slate-900">{overview?.totalPlays || 0}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Điểm trung bình</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {overview?.avgTotalScore !== undefined ? overview.avgTotalScore.toFixed(1) : 0} <span className="text-sm text-slate-400 font-normal">/ 100</span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${overview && overview.passRate >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Tỷ lệ vượt qua (≥70đ)</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {overview?.passRate !== undefined ? overview.passRate.toFixed(1) : 0}%
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${overview ? getHappinessColor(overview.avgHappiness).replace('text-', 'bg-').replace('600', '100') + ' ' + getHappinessColor(overview.avgHappiness) : ''}`}>
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Mức hài lòng TB</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {overview?.avgHappiness !== undefined ? overview.avgHappiness.toFixed(1) : 0}%
                </h3>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 2 - 3T Category */}
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất theo từng tiêu chí 3T</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {modulePerf && [
                { id: 'friendly', name: "Thân thiện", score: modulePerf.friendly, max: modulePerf.friendlyMax, color: "bg-blue-500" },
                { id: 'proficient', name: "Thành thạo", score: modulePerf.proficient, max: modulePerf.proficientMax, color: "bg-orange-500" },
                { id: 'dedicated', name: "Tận tâm", score: modulePerf.dedicated, max: modulePerf.dedicatedMax, color: "bg-green-500" }
              ].map(cat => {
                const pct = (cat.score / cat.max) * 100;
                const isWeakest = weakestCat?.name === cat.name;
                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-700">{cat.name}</span>
                        {isWeakest && <Badge variant="outline" className="text-[10px] text-red-600 border-red-200 bg-red-50">Điểm yếu nhất</Badge>}
                      </div>
                      <span className="text-sm font-bold">{cat.score.toFixed(1)} / {cat.max} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${cat.color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Section 3 - Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố điểm số</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dist && dist.map(d => {
                const pct = totalDistCount > 0 ? (d.count / totalDistCount) * 100 : 0;
                const color = bandColors[d.label] || "bg-slate-500";
                return (
                  <div key={d.band} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{d.label} <span className="text-slate-400 text-xs">({d.band})</span></span>
                      <span className="font-medium">{d.count} lượt <span className="text-slate-400 font-normal">({pct.toFixed(1)}%)</span></span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-sm flex">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-sm ${color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Section 4 - Badge Breakdown */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">Phân bố huy hiệu</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {badges && badges.map(b => {
              const emojiMatch = b.badge.match(/^[^\w\s]+/);
              const emoji = emojiMatch ? emojiMatch[0] : "🏅";
              const name = b.badge.replace(/^[^\w\s]+\s*/, '');
              return (
                <Card key={b.badge}>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">{emoji}</div>
                    <div className="text-sm font-semibold text-slate-700 line-clamp-1">{name}</div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">{b.count}</div>
                    <div className="text-xs text-slate-500">lượt đạt</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Section 5 - Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" />
              Phiên chơi gần đây
            </CardTitle>
            <CardDescription>20 lượt chơi mới nhất</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead className="text-center">Điểm</TableHead>
                    <TableHead className="hidden md:table-cell text-center">3T (Thiện/Thạo/Tâm)</TableHead>
                    <TableHead>Huy hiệu</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">Hài lòng</TableHead>
                    <TableHead className="text-right">Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent && recent.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.playerName}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={`${getScoreColor(r.totalScore)} font-bold`}>
                          {r.totalScore}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center text-sm text-slate-500">
                        {r.friendlyScore} / {r.proficientScore} / {r.dedicatedScore}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{r.badge.split(' ')[0]}</span>
                          <span className="hidden sm:inline text-sm truncate max-w-[120px]">{r.badge.substring(r.badge.indexOf(' ') + 1)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center">
                        <span className={`text-sm font-medium ${getHappinessColor(r.happinessPercent)}`}>
                          {r.happinessPercent}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-slate-500 whitespace-nowrap">
                        {r.createdAt ? formatTimeAgo(r.createdAt.toString()) : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
