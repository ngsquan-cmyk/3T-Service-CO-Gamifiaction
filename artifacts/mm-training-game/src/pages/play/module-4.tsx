import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { useSoundEffects } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";

export default function Module4({ onComplete }: { onComplete: () => void }) {
  const { addProficient, adjustHappiness } = useGame();
  const { correct, wrong } = useSoundEffects();
  const [showError, setShowError] = useState(false);

  const options = [
    { id: 1, name: "Happy Price 25KG", size: "25kg", isCorrect: true, type: "Horeca" },
    { id: 2, name: "Cái Lân 25KG", size: "25kg", isCorrect: true, type: "Horeca" },
    { id: 3, name: "Happy Price 9KG", size: "9kg", isCorrect: false, type: "Gia đình" },
    { id: 4, name: "Cái Lân 9KG", size: "9kg", isCorrect: false, type: "Gia đình" },
  ];

  const handleSelect = (isCorrect: boolean) => {
    if (isCorrect) {
      addProficient(8);
      adjustHappiness(10);
      correct();
      onComplete();
    } else {
      adjustHappiness(-10);
      wrong();
      setShowError(true);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Tư Vấn Đúng</h2>
        <p className="text-muted-foreground">Hiểu đúng nhu cầu của từng nhóm khách hàng.</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative">
        <div className="absolute -top-6 left-6 text-5xl">👨‍🍳</div>
        <p className="text-lg font-medium text-foreground mt-4 italic">
          "Tôi đang cần mua dầu ăn để dùng cho nhà hàng quán ăn của tôi."
        </p>
      </div>

      <p className="font-semibold text-center">Bạn nên tư vấn sản phẩm nào?</p>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {options.map(opt => (
          <Button
            key={opt.id}
            variant="outline"
            className="h-auto flex flex-col p-4 items-center justify-center rounded-xl bg-card border-2 hover:border-primary transition-all group"
            onClick={() => handleSelect(opt.isCorrect)}
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🛢️</div>
            <span className="font-bold text-sm text-center line-clamp-2 leading-tight h-10">{opt.name}</span>
            <span className="text-xs text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded">{opt.size}</span>
          </Button>
        ))}
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
              <p className="text-muted-foreground mb-6">Khách hàng Horeca (Nhà hàng/Khách sạn) cần mua số lượng lớn để tiết kiệm chi phí. Chai 9KG là quá nhỏ.</p>
              <Button className="w-full h-12" onClick={() => setShowError(false)}>Thử lại</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
