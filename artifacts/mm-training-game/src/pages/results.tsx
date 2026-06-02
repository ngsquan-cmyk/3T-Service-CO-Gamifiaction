import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { useGame } from "@/lib/game-context";
import { useSoundEffects } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitScore } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const { state, startGame } = useGame();
  const { gameComplete } = useSoundEffects();
  const submitScore = useSubmitScore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handlePlayAgain = () => {
    startGame();
    setLocation("/play");
  };

  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Calculate score and badge
  const totalScore = state.friendlyScore + state.proficientScore + state.dedicatedScore;
  
  let badge = "🥉 Thu ngân giỏi chuyên môn";
  if (totalScore >= 95) badge = "🌟 Ngôi sao trải nghiệm khách hàng";
  else if (totalScore >= 85) badge = "🏆 Đại sứ 3T MM";
  else if (totalScore >= 70) badge = "🥇 Chuyên gia dịch vụ khách hàng";
  else if (totalScore >= 50) badge = "🥈 Thu ngân chuyên nghiệp";

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    // Play fanfare
    gameComplete();

    submitScore.mutate({
      data: {
        playerName: name,
        totalScore,
        friendlyScore: state.friendlyScore,
        proficientScore: state.proficientScore,
        dedicatedScore: state.dedicatedScore,
        happinessPercent: state.happinessPercent,
        badge,
        paymentErrors: state.paymentErrors,
        avgProcessingSeconds: state.startTime && state.endTime ? Math.round((state.endTime - state.startTime) / 1000) : null
      }
    }, {
      onSuccess: () => {
        setSubmitted(true);
        toast({ title: "Đã lưu thành tích!" });
      },
      onError: () => {
        toast({ title: "Lỗi kết nối", description: "Không thể lưu điểm lúc này", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-primary/10 to-background flex flex-col p-4 pb-8 overflow-y-auto">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md mx-auto w-full flex-1 flex flex-col"
      >
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-extrabold text-primary mb-2">Hoàn Thành!</h1>
          <p className="text-muted-foreground">Báo cáo kết quả đào tạo</p>
        </div>

        <div className="bg-card border border-border shadow-lg rounded-3xl p-6 mb-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Danh Hiệu</span>
            <div className="text-2xl font-bold text-center text-secondary bg-secondary/10 px-4 py-2 rounded-xl">
              {badge}
            </div>
          </div>

          <div className="flex justify-center items-end gap-2 mb-8">
            <span className="text-6xl font-black text-primary leading-none">{totalScore}</span>
            <span className="text-xl font-bold text-muted-foreground mb-1">/100</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium text-foreground">😊 Thân thiện (Max: 30)</span>
              <span className="font-bold">{state.friendlyScore} pts</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium text-foreground">⚡ Thành thạo (Max: 40)</span>
              <span className="font-bold">{state.proficientScore} pts</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium text-foreground">❤️ Tận tâm (Max: 30)</span>
              <span className="font-bold">{state.dedicatedScore} pts</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              <span className="font-bold text-primary">Mức độ hài lòng</span>
              <span className="font-bold text-primary">{state.happinessPercent}%</span>
            </div>
          </div>
        </div>

        {!submitted ? (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold mb-4">Lưu thành tích</h3>
            <div className="flex gap-2">
              <Input 
                placeholder="Tên của bạn..." 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="h-12 text-lg"
              />
              <Button 
                onClick={handleSubmit} 
                disabled={!name.trim() || submitScore.isPending}
                className="h-12 px-6"
              >
                Lưu
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <a
              href="https://training.mmvietnam.com/record-learning/AT1WlXBEm6C5cTLvPDL0bDa8"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button
                size="lg"
                className="w-full h-14 rounded-xl text-lg font-bold bg-[#003087] hover:bg-[#002070] text-white gap-2"
                data-testid="button-record-learning"
              >
                <ExternalLink className="h-5 w-5" />
                Ghi Nhận Hoàn Thành Đào Tạo
              </Button>
            </a>
            <Link
              href={`/certificate?name=${encodeURIComponent(name)}&score=${totalScore}&badge=${encodeURIComponent(badge)}&friendly=${state.friendlyScore}&proficient=${state.proficientScore}&dedicated=${state.dedicatedScore}&happiness=${state.happinessPercent}&date=${new Date().toISOString().split("T")[0]}`}
              className="w-full block"
            >
              <Button
                size="lg"
                className="w-full h-14 rounded-xl text-lg font-bold bg-[#C8A951] hover:bg-[#b8973f] text-white gap-2"
                data-testid="button-view-certificate"
              >
                <Award className="h-5 w-5" />
                Xem Chứng Chỉ
              </Button>
            </Link>
            <Link href="/leaderboard" className="w-full block">
              <Button size="lg" className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90">
                Xem Bảng Xếp Hạng
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 rounded-xl text-lg font-bold border-secondary text-secondary hover:bg-secondary/5"
              onClick={handlePlayAgain}
              data-testid="button-play-again"
            >
              🔄 Thử Lại
            </Button>
            <Link href="/" className="w-full block">
              <Button variant="outline" size="lg" className="w-full h-14 rounded-xl text-lg font-bold">
                Trang Chủ
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
