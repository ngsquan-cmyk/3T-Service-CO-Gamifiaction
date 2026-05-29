import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { useSoundEffects } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";

export default function Module5({ onComplete }: { onComplete: () => void }) {
  const { addDedicated, adjustHappiness } = useGame();
  const { correct, wrong, scan } = useSoundEffects();
  const [selected, setSelected] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);

  const options = [
    { id: 'A', text: "Chờ khách tự xử lý để tránh phiền", isCorrect: false },
    { id: 'B', text: "Hỗ trợ đóng gói hàng hóa", isCorrect: true },
    { id: 'C', text: "Gọi bảo vệ hỗ trợ chuyển hàng ra xe", isCorrect: true },
    { id: 'D', text: "Nhẹ nhàng nói khách cứ để hàng nặng trên xe đẩy", isCorrect: true },
  ];

  const toggleSelect = (id: string) => {
    scan();
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    const hasA = selected.includes('A');
    const hasCorrect = selected.includes('B') && selected.includes('C') && selected.includes('D');

    if (hasA || selected.length === 0) {
      adjustHappiness(-10);
      wrong();
      setShowError(true);
    } else {
      let pts = selected.length * 3;
      if (hasCorrect) pts = 10;
      addDedicated(pts);
      adjustHappiness(15);
      correct();
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Tận Tâm Phục Vụ</h2>
        <p className="text-muted-foreground">Quan sát và chủ động giúp đỡ.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <div className="text-6xl">👵</div>
        <p className="text-sm font-medium">Một khách hàng lớn tuổi vừa thanh toán xong rất nhiều hàng hóa cồng kềnh.</p>
      </div>

      <div className="space-y-3 flex-1">
        <p className="font-semibold text-center">Bạn có thể làm gì? (Chọn nhiều)</p>
        
        {options.map(opt => (
          <Button 
            key={opt.id}
            variant={selected.includes(opt.id) ? "default" : "outline"} 
            className={`w-full h-auto py-4 text-left justify-start px-4 text-sm font-medium rounded-xl whitespace-normal ${
              selected.includes(opt.id) ? 'bg-primary border-primary' : ''
            }`}
            onClick={() => toggleSelect(opt.id)}
          >
            <div className="flex items-start gap-3 w-full">
              <div className={`mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center ${selected.includes(opt.id) ? 'border-white bg-white text-primary' : 'border-input'}`}>
                {selected.includes(opt.id) && "✓"}
              </div>
              <span className="leading-tight">{opt.text}</span>
            </div>
          </Button>
        ))}
      </div>

      <Button size="lg" className="w-full h-14 rounded-xl text-lg font-bold" onClick={handleSubmit}>
        Xác nhận
      </Button>

      <AnimatePresence>
        {showError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center border-t-4 border-destructive">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2">Tận tâm là gì?</h3>
              <p className="text-muted-foreground mb-6">Tận tâm là làm một điều nhỏ nhưng ý nghĩa với khách hàng. Đừng để khách hàng yếu thế phải tự xoay sở một mình.</p>
              <Button className="w-full h-12" onClick={() => setShowError(false)}>Thử lại</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
