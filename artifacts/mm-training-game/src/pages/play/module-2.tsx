import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { useSoundEffects } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";

export default function Module2({ onComplete }: { onComplete: () => void }) {
  const { addFriendly, adjustHappiness } = useGame();
  const { correct, wrong } = useSoundEffects();
  const [showError, setShowError] = useState(false);
  const [selectedCustomer] = useState(() => {
    const customers = [
      { emoji: "👨‍👩‍👧", desc: "Gia đình" },
      { emoji: "👵", desc: "Khách lớn tuổi" },
      { emoji: "👩‍👦", desc: "Mẹ và bé" }
    ];
    return customers[Math.floor(Math.random() * customers.length)];
  });

  const handleChoice = (isCorrect: boolean) => {
    if (isCorrect) {
      addFriendly(15);
      adjustHappiness(10);
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
        <h2 className="text-2xl font-bold text-primary mb-2">Chào Hỏi Thân Thiện</h2>
        <p className="text-muted-foreground">Khách hàng tiến đến quầy thu ngân.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-card rounded-2xl border border-border p-6 shadow-sm">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-8xl mb-4"
        >
          {selectedCustomer.emoji}
        </motion.div>
        <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold">
          {selectedCustomer.desc}
        </span>
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-center mb-4">Bạn sẽ làm gì?</p>
        
        <Button 
          variant="outline" 
          className="w-full h-14 text-left justify-start px-6 text-base font-medium rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          onClick={() => handleChoice(false)}
        >
          "Tiếp theo."
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-14 text-left justify-start px-6 text-base font-medium rounded-xl hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
          onClick={() => handleChoice(true)}
        >
          "Dạ MM xin chào Anh/Chị."
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-14 text-left justify-start px-6 text-base font-medium rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          onClick={() => handleChoice(false)}
        >
          (Im lặng và quét hàng)
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
              <div className="text-5xl mb-4">🙁</div>
              <h3 className="text-xl font-bold mb-2">Hãy thử đặt mình vào vị trí khách hàng</h3>
              <p className="text-muted-foreground mb-6">Một lời chào thân thiện mở ra trải nghiệm tốt. Đừng để khách cảm thấy như một cỗ máy xử lý giao dịch.</p>
              <Button className="w-full h-12" onClick={() => setShowError(false)}>Thử lại</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
