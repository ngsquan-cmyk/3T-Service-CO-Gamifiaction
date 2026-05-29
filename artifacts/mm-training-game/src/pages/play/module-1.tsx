import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { useSoundEffects } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";

export default function Module1({ onComplete }: { onComplete: () => void }) {
  const { addFriendly, adjustHappiness } = useGame();
  const { correct, scan } = useSoundEffects();
  const [checked, setChecked] = useState({ tag: false, shirt: false, smile: false, appearance: false });
  const [showWarning, setShowWarning] = useState(false);

  const allChecked = Object.values(checked).every(Boolean);

  const toggle = (key: keyof typeof checked) => {
    scan();
    setChecked(prev => ({ ...prev, [key]: true }));
  };

  const handleNext = () => {
    if (allChecked) {
      addFriendly(5);
      adjustHappiness(10);
      correct();
      onComplete();
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Ấn Tượng Đầu Tiên</h2>
        <p className="text-muted-foreground">Chuẩn bị trước khi vào ca làm việc.</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-48 h-48 bg-primary/5 rounded-full flex items-center justify-center text-7xl border-4 border-primary/20">
          {checked.smile ? "😊" : "😐"}
          {!checked.shirt && <span className="absolute -bottom-4 text-3xl">👔❓</span>}
          {!checked.tag && <span className="absolute -left-4 text-3xl">🏷️❓</span>}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
        <Button 
          variant={checked.tag ? "default" : "outline"} 
          className="w-full justify-start h-12 text-left px-4"
          onClick={() => toggle('tag')}
          disabled={checked.tag}
        >
          <span className="mr-3">{checked.tag ? "✅" : "⭕"}</span> Đeo bảng tên
        </Button>
        <Button 
          variant={checked.shirt ? "default" : "outline"} 
          className="w-full justify-start h-12 text-left px-4"
          onClick={() => toggle('shirt')}
          disabled={checked.shirt}
        >
          <span className="mr-3">{checked.shirt ? "✅" : "⭕"}</span> Áo bỏ trong quần
        </Button>
        <Button 
          variant={checked.smile ? "default" : "outline"} 
          className="w-full justify-start h-12 text-left px-4"
          onClick={() => toggle('smile')}
          disabled={checked.smile}
        >
          <span className="mr-3">{checked.smile ? "✅" : "⭕"}</span> Tươi cười
        </Button>
        <Button 
          variant={checked.appearance ? "default" : "outline"} 
          className="w-full justify-start h-12 text-left px-4"
          onClick={() => toggle('appearance')}
          disabled={checked.appearance}
        >
          <span className="mr-3">{checked.appearance ? "✅" : "⭕"}</span> Kiểm tra diện mạo
        </Button>
      </div>

      <Button size="lg" className="w-full h-14 rounded-xl text-lg font-bold" onClick={handleNext}>
        Bắt đầu ca làm việc
      </Button>

      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8 bg-black/40 backdrop-blur-sm"
          >
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2">Chưa sẵn sàng!</h3>
              <p className="text-muted-foreground mb-6">Khách hàng nhìn thấy bạn trước khi nhìn thấy hóa đơn. Hãy chuẩn bị kỹ!</p>
              <Button className="w-full h-12" onClick={() => setShowWarning(false)}>Đã hiểu</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
