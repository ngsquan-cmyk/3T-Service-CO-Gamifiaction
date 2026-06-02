import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { useSoundEffects } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Item = { id: number; emoji: string; name: string; isDuplicate: boolean; isBulky: boolean; status: 'pending' | 'scanned' | 'skipped' };

const ALL_ITEMS = [
  { emoji: "🥛", name: "Sữa tươi", isDuplicate: false, isBulky: false },
  { emoji: "🍎", name: "Táo", isDuplicate: false, isBulky: false },
  { emoji: "🧴", name: "Dầu gội", isDuplicate: false, isBulky: false },
  { emoji: "🍜", name: "Mì gói", isDuplicate: false, isBulky: false },
  { emoji: "📦", name: "Bột giặt lớn", isDuplicate: false, isBulky: true },
  { emoji: "🍎", name: "Táo (đã quét)", isDuplicate: true, isBulky: false },
  { emoji: "🧻", name: "Giấy vệ sinh", isDuplicate: false, isBulky: true },
];

export default function Module3({ onComplete }: { onComplete: () => void }) {
  const { addProficient, adjustHappiness, recordPaymentError } = useGame();
  const { scan, correct, wrong } = useSoundEffects();
  
  const [timeLeft, setTimeLeft] = useState(30);
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Generate random queue
    const shuffled = [...ALL_ITEMS].sort(() => Math.random() - 0.5).map((item, i) => ({ ...item, id: i, status: 'pending' as const }));
    setItems(shuffled);
  }, []);

  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !finished) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !finished) {
      handleFinish();
    }
  }, [isPlaying, timeLeft, finished]);

  const handleFinish = () => {
    setFinished(true);
    let pts = 0;
    if (score > items.length * 0.8) pts = 25;
    else if (score > items.length * 0.5) pts = 18;
    else pts = 10;
    
    addProficient(pts);
    correct();
    setTimeout(onComplete, 2000);
  };

  const handleAction = (action: 'scan' | 'skip') => {
    const item = items[currentIndex];
    let correctAction = false;
    
    if (item.isDuplicate) {
      correctAction = action === 'skip';
    } else {
      correctAction = action === 'scan';
    }

    if (correctAction) {
      scan();
      setScore(s => s + 1);
      adjustHappiness(2);
    } else {
      wrong();
      adjustHappiness(-5);
      recordPaymentError();
    }

    const newItems = [...items];
    newItems[currentIndex].status = action === 'scan' ? 'scanned' : 'skipped';
    setItems(newItems);

    if (currentIndex + 1 < items.length) {
      setCurrentIndex(c => c + 1);
    } else {
      handleFinish();
    }
  };

  if (!isPlaying) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-4">⏱️</div>
        <h2 className="text-2xl font-bold text-primary">Thanh Toán Nhanh</h2>
        <p className="text-muted-foreground">Quét hàng hóa nhanh và chính xác. Bỏ qua các món trùng lặp (đã quét).</p>
        <Button size="lg" className="w-full h-14 rounded-xl text-lg font-bold mt-8" onClick={() => setIsPlaying(true)}>
          Bắt Đầu (30s)
        </Button>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="font-mono text-xl font-bold bg-muted px-4 py-2 rounded-lg">
          {timeLeft}s
        </div>
        <div className="font-bold text-primary">
          Đúng: {score}/{items.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-card rounded-2xl border border-border shadow-inner relative overflow-hidden mb-6">
        {/* Conveyor belt background */}
        <div className="absolute bottom-0 w-full h-24 bg-muted/50 border-t border-border" />
        
        <AnimatePresence mode="popLayout">
          {!finished && currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              className="z-10 flex flex-col items-center pb-8"
            >
              <div className="text-8xl filter drop-shadow-lg mb-4">{currentItem.emoji}</div>
              <div className="bg-white/90 backdrop-blur px-6 py-2 rounded-full font-bold text-lg shadow-sm border border-border">
                {currentItem.name}
              </div>
              {currentItem.isBulky && (
                <div className="text-xs font-bold text-secondary mt-2 bg-secondary/10 px-2 py-1 rounded">
                  HÀNG NẶNG
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {finished && (
          <div className="z-10 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold">Hoàn Thành!</h3>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pb-4">
        <Button 
          variant="destructive" 
          size="lg" 
          className="h-20 text-xl font-bold rounded-2xl shadow-sm"
          onClick={() => handleAction('skip')}
          disabled={finished}
        >
          Bỏ Qua (Trùng)
        </Button>
        <Button 
          variant="default" 
          size="lg" 
          className="h-20 text-xl font-bold rounded-2xl shadow-sm bg-success hover:bg-success/90"
          onClick={() => handleAction('scan')}
          disabled={finished}
        >
          Quét
        </Button>
      </div>
    </div>
  );
}
