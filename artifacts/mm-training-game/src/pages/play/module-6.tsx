import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { useSoundEffects } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";

export default function Module6({ onComplete }: { onComplete: () => void }) {
  const { addDedicated, adjustHappiness } = useGame();
  const { correct, wrong } = useSoundEffects();
  const [showError, setShowError] = useState(false);

  const handleChoice = (id: string) => {
    if (id === 'C') {
      addDedicated(15);
      adjustHappiness(20);
      correct();
      onComplete();
    } else {
      adjustHappiness(-15);
      wrong();
      setShowError(true);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Khách Khó Tính</h2>
        <p className="text-muted-foreground">Xử lý phàn nàn chuyên nghiệp.</p>
      </div>

      <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 relative">
        <div className="absolute -top-6 left-6 text-5xl">😡</div>
        <p className="text-lg font-medium text-foreground mt-4 italic">
          "Trời ơi, tôi phải xếp hàng chờ quá lâu rồi đấy! Làm ăn kiểu gì vậy?"
        </p>
      </div>

      <div className="space-y-3 flex-1">
        <p className="font-semibold text-center mb-4">Cách phản hồi tốt nhất?</p>
        
        <Button 
          variant="outline" 
          className="w-full h-auto py-4 text-left justify-start px-6 text-sm font-medium rounded-xl whitespace-normal hover:bg-muted"
          onClick={() => handleChoice('A')}
        >
          "Dạ không phải lỗi của em, quầy bên kia đông quá ạ."
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-auto py-4 text-left justify-start px-6 text-sm font-medium rounded-xl whitespace-normal hover:bg-muted"
          onClick={() => handleChoice('D')}
        >
          "Dạ do hôm nay nhân viên nghỉ ốm nhiều quá mong Anh/Chị thông cảm."
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-auto py-4 text-left justify-start px-6 text-sm font-medium rounded-xl whitespace-normal hover:bg-muted"
          onClick={() => handleChoice('C')}
        >
          "Em xin lỗi vì Anh/Chị phải chờ đợi. Em sẽ hỗ trợ thanh toán cho Anh/Chị ngay ạ."
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-auto py-4 text-left justify-start px-6 text-sm font-medium rounded-xl whitespace-normal hover:bg-muted"
          onClick={() => handleChoice('B')}
        >
          "Anh/Chị thông cảm, siêu thị đang đông khách."
        </Button>
      </div>

      <AnimatePresence>
        {showError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center border-t-4 border-destructive">
              <div className="text-5xl mb-4">🛑</div>
              <h3 className="text-xl font-bold mb-2">Đừng giải thích dài dòng</h3>
              <p className="text-muted-foreground mb-6">Khách hàng đang bực bội không muốn nghe lý do nội bộ của siêu thị. Điều họ cần là một lời xin lỗi chân thành và hành động giải quyết vấn đề ngay lập tức.</p>
              <Button className="w-full h-12" onClick={() => setShowError(false)}>Thử lại</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
