import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { useSoundEffects } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";

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

function calcPts(score: number, total: number, timeLeft: number): { pts: number; label: string } {
  if (total === 0) return { pts: 10, label: "" };
  const allCorrect = score === total;
  const mostCorrect = score >= total - 1; // 6/7 or better
  const goodCorrect = score >= Math.ceil(total * 0.7); // 70%+

  if (allCorrect && timeLeft >= 15) return { pts: 40, label: "⚡ Nhanh & Chính xác tuyệt đối!" };
  if (allCorrect && timeLeft >= 5)  return { pts: 32, label: "✅ Chính xác, tốc độ tốt!" };
  if (allCorrect)                   return { pts: 28, label: "✅ Chính xác hoàn toàn!" };
  if (mostCorrect && timeLeft >= 10) return { pts: 22, label: "👍 Gần hoàn hảo, khá nhanh!" };
  if (mostCorrect)                   return { pts: 18, label: "👍 Gần hoàn hảo!" };
  if (goodCorrect)                   return { pts: 14, label: "Cần luyện thêm tốc độ." };
  return { pts: 10, label: "Hãy luyện tập thêm nhé!" };
}

export default function Module3({ onComplete }: { onComplete: () => void }) {
  const { addProficient, adjustHappiness, recordPaymentError } = useGame();
  const { scan, correct, wrong } = useSoundEffects();

  const [timeLeft, setTimeLeft] = useState(30);
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [resultLabel, setResultLabel] = useState("");

  const scoreRef   = useRef(0);
  const itemsRef   = useRef<Item[]>([]);
  const timeLeftRef = useRef(30);
  const finishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const shuffled = [...ALL_ITEMS]
      .sort(() => Math.random() - 0.5)
      .map((item, i) => ({ ...item, id: i, status: 'pending' as const }));
    itemsRef.current = shuffled;
    setItems(shuffled);
  }, []);

  // Keep timeLeftRef in sync so handleFinish always reads latest
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  const handleFinish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);

    const s = scoreRef.current;
    const t = itemsRef.current.length;
    const tl = timeLeftRef.current;
    const { pts, label } = calcPts(s, t, tl);

    setResultLabel(label);
    addProficient(pts);
    correct();
    setTimeout(() => onCompleteRef.current(), 2000);
  };

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || finishedRef.current || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  // Trigger finish when timer hits 0
  useEffect(() => {
    if (isPlaying && timeLeft === 0) handleFinish();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isPlaying]);

  const handleAction = (action: 'scan' | 'skip') => {
    if (finishedRef.current) return;
    const item = itemsRef.current[currentIndex];
    if (!item) return;

    const correctAction = item.isDuplicate ? action === 'skip' : action === 'scan';

    if (correctAction) {
      scan();
      scoreRef.current += 1;
      setScore(scoreRef.current);
      adjustHappiness(2);
    } else {
      wrong();
      adjustHappiness(-5);
      recordPaymentError();
    }

    const newItems = [...itemsRef.current];
    newItems[currentIndex] = { ...newItems[currentIndex], status: action === 'scan' ? 'scanned' : 'skipped' };
    itemsRef.current = newItems;
    setItems(newItems);

    if (currentIndex + 1 < itemsRef.current.length) {
      setCurrentIndex(c => c + 1);
    } else {
      handleFinish();
    }
  };

  if (!isPlaying) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-4">⚡</div>
        <h2 className="text-2xl font-bold text-primary">Quét Mã Nhanh & Chính Xác</h2>
        <p className="text-muted-foreground">Quét đúng hàng hóa, bỏ qua món trùng lặp. Vừa nhanh vừa chính xác sẽ được điểm cao!</p>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-left space-y-1 w-full">
          <p className="font-bold text-primary mb-2">Thang điểm:</p>
          <p>⚡ Nhanh + Chính xác 100%: <span className="font-bold">40 điểm</span></p>
          <p>✅ Chính xác 100%: <span className="font-bold">28–32 điểm</span></p>
          <p>👍 Gần hoàn hảo: <span className="font-bold">18–22 điểm</span></p>
          <p>📊 Trên 70%: <span className="font-bold">14 điểm</span></p>
        </div>
        <Button size="lg" className="w-full h-14 rounded-xl text-lg font-bold mt-4" onClick={() => setIsPlaying(true)}>
          Bắt Đầu (30 giây)
        </Button>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className={`font-mono text-xl font-bold px-4 py-2 rounded-lg ${timeLeft <= 10 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-muted'}`}>
          ⏱ {timeLeft}s
        </div>
        <div className="font-bold text-primary">
          Đúng: {score}/{items.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-card rounded-2xl border border-border shadow-inner relative overflow-hidden mb-4">
        <div className="absolute bottom-0 w-full h-24 bg-muted/50 border-t border-border" />

        <AnimatePresence mode="popLayout">
          {!finished && currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="z-10 flex flex-col items-center pb-8"
            >
              <div className="text-8xl filter drop-shadow-lg mb-4">{currentItem.emoji}</div>
              <div className="bg-white/90 backdrop-blur px-6 py-2 rounded-full font-bold text-lg shadow-sm border border-border">
                {currentItem.name}
              </div>
              {currentItem.isDuplicate && (
                <div className="text-xs font-bold text-destructive mt-2 bg-destructive/10 px-3 py-1 rounded-full border border-destructive/30">
                  ⚠️ ĐÃ QUÉT RỒI
                </div>
              )}
              {currentItem.isBulky && !currentItem.isDuplicate && (
                <div className="text-xs font-bold text-secondary mt-2 bg-secondary/10 px-2 py-1 rounded">
                  HÀNG NẶNG
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {finished && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="z-10 text-center px-6"
          >
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-bold">Hoàn Thành!</h3>
            <p className="text-muted-foreground mt-1">Đúng: {score}/{items.length} · Thời gian còn: {timeLeftRef.current}s</p>
            {resultLabel && (
              <p className="mt-2 font-semibold text-primary text-sm">{resultLabel}</p>
            )}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pb-2">
        <Button
          variant="destructive"
          size="lg"
          className="h-20 text-lg font-bold rounded-2xl shadow-sm"
          onClick={() => handleAction('skip')}
          disabled={finished}
        >
          Bỏ Qua<br/><span className="text-xs font-normal opacity-80">(Trùng lặp)</span>
        </Button>
        <Button
          variant="default"
          size="lg"
          className="h-20 text-lg font-bold rounded-2xl shadow-sm bg-success hover:bg-success/90"
          onClick={() => handleAction('scan')}
          disabled={finished}
        >
          Quét ✓<br/><span className="text-xs font-normal opacity-80">(Hàng mới)</span>
        </Button>
      </div>
    </div>
  );
}
