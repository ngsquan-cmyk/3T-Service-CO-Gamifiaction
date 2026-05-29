import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const MOTIVATIONS = [
  "Khách hàng không chỉ mua sản phẩm. Họ mua trải nghiệm.",
  "Thái độ tích cực giúp khách hàng dễ bỏ qua những bất tiện nhỏ.",
  "Một nụ cười có thể tạo nên sự khác biệt.",
  "Khách hàng không nhớ chúng ta bán gì. Khách hàng nhớ cảm xúc chúng ta mang lại."
];

export function MotivationalPopup({ onContinue }: { onContinue: () => void }) {
  const message = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          💡
        </div>
        <h3 className="text-xl font-bold text-foreground mb-4">Bạn có biết?</h3>
        <p className="text-muted-foreground italic mb-6">"{message}"</p>
        <Button onClick={onContinue} className="w-full h-12 text-lg rounded-xl">
          Tiếp tục
        </Button>
      </motion.div>
    </motion.div>
  );
}
