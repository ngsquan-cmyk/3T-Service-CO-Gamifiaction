import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

type Props = {
  onDone: () => void;
};

const slides = [
  {
    id: 1,
    emoji: "🏪",
    title: "Chào Mừng Đến Với Đào Tạo 3T",
    subtitle: "Thân Thiện · Thành Thạo · Tận Tâm",
    content: (
      <div className="space-y-3">
        <p className="text-center text-sm text-slate-600 leading-relaxed">
          Bạn vào vai <strong>nhân viên Thu ngân MM Mega Market</strong> và phải
          vượt qua 6 thử thách thực tế để trở thành:
        </p>
        <div className="bg-[#003087] text-white rounded-2xl py-4 px-5 text-center shadow">
          <div className="text-2xl font-black">🌟 Đại Sứ 3T MM</div>
          <div className="text-xs opacity-80 mt-1">Mức cao nhất — 95–100 điểm</div>
        </div>
        <p className="text-center text-xs text-slate-500 italic">
          "Khách hàng không nhớ chúng ta bán gì.<br />
          Khách hàng nhớ cảm xúc chúng ta mang lại."
        </p>
      </div>
    ),
  },
  {
    id: 2,
    emoji: "🏆",
    title: "Hệ Thống Điểm 3T",
    subtitle: "Tổng 100 điểm — 6 module",
    content: (
      <div className="space-y-3">
        {[
          { label: "Thân Thiện", pts: 30, max: 30, color: "bg-blue-500", emoji: "😊" },
          { label: "Thành Thạo", pts: 40, max: 40, color: "bg-orange-500", emoji: "⚡" },
          { label: "Tận Tâm", pts: 30, max: 30, color: "bg-green-500", emoji: "❤️" },
        ].map((row) => (
          <div key={row.label} className="bg-slate-50 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-sm">
                {row.emoji} {row.label}
              </span>
              <span className="text-xs font-bold text-slate-500">
                tối đa {row.pts} điểm
              </span>
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${row.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>
        ))}
        <p className="text-center text-xs text-slate-500">
          Mỗi lựa chọn đúng sẽ cộng điểm vào tiêu chí tương ứng.
        </p>
      </div>
    ),
  },
  {
    id: 3,
    emoji: "😍",
    title: "Chỉ Số Cảm Xúc Khách Hàng",
    subtitle: "Theo dõi mức độ hài lòng theo thời gian thực",
    content: (
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-4">
          {[
            { e: "😡", label: "Không\nhài lòng" },
            { e: "😐", label: "Bình\nthường" },
            { e: "🙂", label: "Hài\nlòng" },
            { e: "😍", label: "Rất\nhài lòng" },
          ].map((item) => (
            <div key={item.e} className="flex flex-col items-center gap-1">
              <span className="text-3xl">{item.e}</span>
              <span className="text-[10px] text-slate-500 text-center leading-tight whitespace-pre">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3 bg-green-50 rounded-xl px-3 py-2">
            <span className="text-xl">✅</span>
            <span className="text-green-700">Chọn đúng → khách hài lòng hơn</span>
          </div>
          <div className="flex items-center gap-3 bg-red-50 rounded-xl px-3 py-2">
            <span className="text-xl">❌</span>
            <span className="text-red-700">Chọn sai → khách kém hài lòng hơn</span>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500">
          Thanh cảm xúc luôn hiển thị ở đầu màn hình trong suốt trò chơi.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    emoji: "💡",
    title: "Một Vài Gợi Ý",
    subtitle: "Trước khi bắt đầu",
    content: (
      <div className="space-y-3">
        {[
          {
            icon: "🎯",
            text: "Đọc kỹ tình huống trước khi chọn đáp án.",
          },
          {
            icon: "💬",
            text: 'Nếu chọn sai, bạn sẽ thấy "Hãy thử đặt mình vào vị trí khách hàng" — đọc giải thích rồi thử lại.',
          },
          {
            icon: "⏱️",
            text: "Không có giới hạn thời gian trong chế độ chính — hãy suy nghĩ cẩn thận.",
          },
          {
            icon: "🏅",
            text: "Đạt 85+ điểm để nhận huy hiệu Đại Sứ 3T MM hoặc cao hơn.",
          },
        ].map((tip, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 bg-slate-50 rounded-xl px-3 py-2.5"
          >
            <span className="text-xl flex-shrink-0">{tip.icon}</span>
            <p className="text-sm text-slate-700 leading-snug">{tip.text}</p>
          </motion.div>
        ))}
      </div>
    ),
  },
];

export function TutorialOverlay({ onDone }: Props) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const isLast = current === slides.length - 1;
  const slide = slides[current];

  const next = () => {
    if (isLast) onDone();
    else setCurrent((c) => c + 1);
  };
  const prev = () => setCurrent((c) => Math.max(0, c - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    touchStartX.current = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "90dvh" }}
      >
        {/* Header */}
        <div className="bg-[#003087] px-6 pt-6 pb-5 relative flex-shrink-0">
          <button
            onClick={onDone}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            data-testid="button-skip-tutorial"
            aria-label="Bỏ qua"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="text-4xl mb-3 text-center">{slide.emoji}</div>
          <h2 className="text-white font-black text-xl text-center leading-tight">
            {slide.title}
          </h2>
          <p className="text-white/70 text-xs text-center mt-1">{slide.subtitle}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              {slide.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex-shrink-0">
          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mb-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "w-6 bg-[#003087]"
                    : "w-2 bg-slate-200"
                }`}
                data-testid={`dot-tutorial-${i}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex gap-2">
            {current > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={prev}
                className="flex-shrink-0 px-3"
                data-testid="button-tutorial-prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={next}
              className="flex-1 h-11 font-bold rounded-xl bg-[#003087] hover:bg-[#002070] text-white gap-1"
              data-testid="button-tutorial-next"
            >
              {isLast ? (
                "Bắt Đầu Ngay!"
              ) : (
                <>
                  Tiếp theo
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
