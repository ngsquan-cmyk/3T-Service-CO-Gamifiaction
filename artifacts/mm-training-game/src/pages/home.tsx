import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/game-context";

export default function Home() {
  const { startGame } = useGame();

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative background circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-3xl" />

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center z-10"
      >
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-border mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-primary text-white font-extrabold text-4xl flex items-center justify-center rounded-2xl shadow-lg transform -rotate-3">
              MM
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-primary mb-2 leading-tight">
            Đại Sứ 3T
          </h1>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Thân Thiện • Thành Thạo • Tận Tâm
          </h2>
          <p className="text-muted-foreground mb-6">
            Trở thành chuyên gia trải nghiệm khách hàng tại MM Mega Market qua thử thách mô phỏng thực tế.
          </p>

          <div className="space-y-4">
            <Link href="/play" className="w-full block" onClick={() => startGame()}>
              <Button size="lg" className="w-full h-14 text-lg font-bold rounded-xl shadow-md hover:scale-[1.02] transition-transform bg-secondary hover:bg-secondary/90 text-white">
                Bắt Đầu
              </Button>
            </Link>
            <Link href="/leaderboard" className="w-full block">
              <Button variant="outline" size="lg" className="w-full h-14 text-lg font-bold rounded-xl">
                Bảng Xếp Hạng
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Mục tiêu: Đạt 100 điểm và làm hài lòng khách hàng.</p>
        </div>
      </motion.div>
    </div>
  );
}
