import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetLeaderboard, useGetGameStats } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Leaderboard() {
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useGetLeaderboard({ limit: 10 });
  const { data: stats, isLoading: isLoadingStats } = useGetGameStats();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground p-6 pt-12 pb-8 rounded-b-3xl shadow-md">
        <h1 className="text-3xl font-extrabold text-center mb-6">Bảng Xếp Hạng 3T</h1>
        
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-xs uppercase opacity-80 font-semibold mb-1">Lượt chơi</div>
            <div className="text-xl font-bold">
              {isLoadingStats ? <Skeleton className="h-7 w-12 mx-auto bg-white/20" /> : stats?.totalPlays || 0}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-xs uppercase opacity-80 font-semibold mb-1">Điểm cao</div>
            <div className="text-xl font-bold text-secondary">
              {isLoadingStats ? <Skeleton className="h-7 w-12 mx-auto bg-white/20" /> : stats?.topScore || 0}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-xs uppercase opacity-80 font-semibold mb-1">Hài lòng TB</div>
            <div className="text-xl font-bold text-success">
              {isLoadingStats ? <Skeleton className="h-7 w-12 mx-auto bg-white/20" /> : `${Math.round(stats?.avgHappiness || 0)}%`}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="space-y-3 mt-4">
          {isLoadingLeaderboard ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))
          ) : leaderboard?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có thành tích nào. Hãy là người đầu tiên!
            </div>
          ) : (
            leaderboard?.map((score, index) => (
              <motion.div 
                key={score.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  index === 0 ? 'bg-yellow-100 text-yellow-600' :
                  index === 1 ? 'bg-gray-200 text-gray-600' :
                  index === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-muted text-muted-foreground'
                }`}>
                  #{index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground truncate">{score.playerName}</div>
                  <div className="text-xs text-muted-foreground truncate">{score.badge}</div>
                </div>

                <div className="text-right">
                  <div className="font-black text-primary text-xl">{score.totalScore}</div>
                  <div className="text-xs font-semibold text-success">{score.happinessPercent}% 😊</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 bg-background border-t border-border sticky bottom-0 z-10">
        <Link href="/" className="block max-w-md mx-auto">
          <Button variant="outline" size="lg" className="w-full h-14 rounded-xl font-bold text-lg">
            Về Trang Chủ
          </Button>
        </Link>
      </div>
    </div>
  );
}
