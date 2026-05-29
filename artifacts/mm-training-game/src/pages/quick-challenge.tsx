import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSoundEffects } from "@/hooks/use-sound";
import { Clock, Flame, ArrowLeft, Trophy, HeartHandshake, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  id: number;
  category: "friendly" | "proficient" | "dedicated";
  points: number;
  situation: string;
  customerEmoji: string;
  question: string;
  choices: { label: string; isCorrect: boolean }[];
  explanation: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1, category: "friendly", points: 5,
    customerEmoji: "👵",
    situation: "Khách lớn tuổi tiến đến quầy.",
    question: "Bạn chào khách như thế nào?",
    choices: [
      { label: "Nhìn màn hình, không nói gì.", isCorrect: false },
      { label: '"Tiếp theo."', isCorrect: false },
      { label: '"Dạ MM xin chào Anh/Chị, em có thể hỗ trợ gì ạ?"', isCorrect: true },
      { label: '"Đặt hàng lên băng chuyền đi ạ."', isCorrect: false },
    ],
    explanation: "Lời chào chủ động và thân thiện tạo ấn tượng đầu tiên tốt đẹp cho khách.",
  },
  {
    id: 2, category: "proficient", points: 5,
    customerEmoji: "🛒",
    situation: "Khách có hàng hóa cả trong xe đẩy lẫn trên băng chuyền.",
    question: "Bạn quét hàng theo thứ tự nào?",
    choices: [
      { label: "Quét hàng trên băng chuyền trước.", isCorrect: false },
      { label: "Quét hàng nặng/cồng kềnh ở dưới xe đẩy trước, băng chuyền sau.", isCorrect: true },
      { label: "Quét bất kỳ thứ tự nào cũng được.", isCorrect: false },
      { label: "Yêu cầu khách đưa tất cả lên băng chuyền.", isCorrect: false },
    ],
    explanation: "Hàng nặng/cồng kềnh dưới xe đẩy được quét tại chỗ để tránh tốn sức của khách và gây ùn tắc.",
  },
  {
    id: 3, category: "dedicated", points: 5,
    customerEmoji: "👨‍👩‍👧‍👦",
    situation: "Gia đình mua nhiều hàng, em bé đang khóc.",
    question: "Bạn xử lý tình huống thế nào?",
    choices: [
      { label: "Làm nhanh rồi nhìn sang chỗ khác.", isCorrect: false },
      { label: '"Gia đình mình dễ thương quá!" và hỗ trợ đóng gói thật nhanh.', isCorrect: true },
      { label: "Yêu cầu gia đình dỗ bé trước rồi mới thanh toán.", isCorrect: false },
      { label: "Gọi bảo vệ vì tiếng ồn.", isCorrect: false },
    ],
    explanation: "Sự quan tâm nhỏ khiến gia đình cảm thấy được chào đón và muốn quay lại MM.",
  },
  {
    id: 4, category: "friendly", points: 5,
    customerEmoji: "😤",
    situation: 'Khách phàn nàn: "Tôi đứng đây lâu lắm rồi mà không ai hỗ trợ."',
    question: "Bạn phản hồi thế nào?",
    choices: [
      { label: '"Không phải lỗi của em."', isCorrect: false },
      { label: '"Anh/Chị cứ chờ thêm chút nữa."', isCorrect: false },
      { label: '"Em xin lỗi vì Anh/Chị phải chờ. Em hỗ trợ ngay bây giờ ạ."', isCorrect: true },
      { label: '"Ca em đông người lắm nên vậy."', isCorrect: false },
    ],
    explanation: "Xin lỗi chân thành và hành động ngay là cách tốt nhất xoa dịu khách khó tính.",
  },
  {
    id: 5, category: "proficient", points: 5,
    customerEmoji: "🍽️",
    situation: 'Khách mở nhà hàng hỏi: "Tôi cần mua dầu ăn số lượng lớn."',
    question: "Bạn tư vấn sản phẩm nào?",
    choices: [
      { label: "Cái Lân 1 lít — tiện dùng.", isCorrect: false },
      { label: "Happy Price 9kg — tiết kiệm.", isCorrect: false },
      { label: "Cái Lân 25kg hoặc Happy Price 25kg — phù hợp cho nhà hàng.", isCorrect: true },
      { label: "Bất kỳ loại nào khách thích.", isCorrect: false },
    ],
    explanation: "Nhà hàng cần số lượng lớn. Loại 25kg phù hợp về chi phí và khối lượng sử dụng.",
  },
  {
    id: 6, category: "dedicated", points: 5,
    customerEmoji: "👴",
    situation: "Khách lớn tuổi mang nhiều túi nặng, tay run run.",
    question: "Bạn làm gì?",
    choices: [
      { label: "Chờ khách tự xử lý.", isCorrect: false },
      { label: 'Chủ động hỏi: "Anh/Chị để em hỗ trợ đóng gói giúp nhé?"', isCorrect: true },
      { label: "Gọi loa yêu cầu hỗ trợ.", isCorrect: false },
      { label: "Tiếp tục quét hàng, không chú ý.", isCorrect: false },
    ],
    explanation: "Chủ động hỗ trợ người lớn tuổi là biểu hiện của sự tận tâm thực sự.",
  },
  {
    id: 7, category: "friendly", points: 5,
    customerEmoji: "🏃",
    situation: 'Khách nói: "Tôi đang rất vội, làm nhanh lên được không?"',
    question: "Bạn phản hồi thế nào?",
    choices: [
      { label: '"Ai cũng đang vội mà Anh/Chị."', isCorrect: false },
      { label: '"Vâng em sẽ ưu tiên hỗ trợ Anh/Chị ngay ạ."', isCorrect: true },
      { label: "Im lặng và cố quét nhanh hơn.", isCorrect: false },
      { label: '"Hàng nhiều quá nên hơi lâu."', isCorrect: false },
    ],
    explanation: "Xác nhận yêu cầu của khách và cam kết hỗ trợ ngay giúp họ thấy được lắng nghe.",
  },
  {
    id: 8, category: "proficient", points: 5,
    customerEmoji: "🧾",
    situation: 'Sau khi thanh toán, khách nhìn hóa đơn và nói: "Sao tổng tiền cao vậy?"',
    question: "Bạn làm gì?",
    choices: [
      { label: 'Nói: "Đúng rồi đó Anh/Chị."', isCorrect: false },
      { label: "Bình tĩnh giải thích từng mục trong hóa đơn cho khách.", isCorrect: true },
      { label: "Nói máy tính tự ra số, em không biết.", isCorrect: false },
      { label: "Yêu cầu khách kiểm tra lại số lượng hàng.", isCorrect: false },
    ],
    explanation: "Giải thích rõ ràng và bình tĩnh giúp khách hiểu và tin tưởng vào quy trình thanh toán.",
  },
  {
    id: 9, category: "friendly", points: 5,
    customerEmoji: "💳",
    situation: 'Khách hỏi: "Có dùng Mcard được không?"',
    question: "Bạn trả lời thế nào?",
    choices: [
      { label: '"Không biết, hỏi quản lý đi."', isCorrect: false },
      { label: '"Dạ được ạ! Để em quét thẻ Mcard cho Anh/Chị nhé."', isCorrect: true },
      { label: '"Thẻ gì vậy?"', isCorrect: false },
      { label: "Im lặng và chờ khách tự quẹt thẻ.", isCorrect: false },
    ],
    explanation: "Biết rõ các phương thức thanh toán và hỗ trợ khách chủ động là dấu hiệu của sự thành thạo.",
  },
  {
    id: 10, category: "dedicated", points: 5,
    customerEmoji: "👩‍🍼",
    situation: "Mẹ đang bế em bé, khó lấy ví thanh toán.",
    question: "Bạn xử lý thế nào?",
    choices: [
      { label: "Đứng chờ không nói gì.", isCorrect: false },
      { label: '"Anh/Chị cứ từ từ, em chờ."', isCorrect: false },
      { label: '"Để em hỗ trợ giữ túi giúp Anh/Chị lấy ví nhé."', isCorrect: true },
      { label: "Nhắc khách thanh toán nhanh vì có người chờ.", isCorrect: false },
    ],
    explanation: "Một hành động nhỏ như giữ hộ túi đồ tạo nên trải nghiệm đáng nhớ với người mẹ.",
  },
  {
    id: 11, category: "friendly", points: 5,
    customerEmoji: "🎉",
    situation: "Khách mua nhiều đồ rõ ràng để tổ chức tiệc.",
    question: "Câu nói nào phù hợp nhất?",
    choices: [
      { label: "Không nói gì, chỉ quét hàng.", isCorrect: false },
      { label: '"Gia đình mình có tiệc vui à? Chúc mừng ạ!"', isCorrect: true },
      { label: '"Anh/Chị mua nhiều vậy?"', isCorrect: false },
      { label: '"Hàng này đắt lắm đó."', isCorrect: false },
    ],
    explanation: "Một câu nói quan tâm, vui vẻ khiến khách cảm thấy gần gũi và được chú ý.",
  },
  {
    id: 12, category: "proficient", points: 5,
    customerEmoji: "🔁",
    situation: "Bạn vô tình quét cùng một sản phẩm hai lần.",
    question: "Bạn làm gì?",
    choices: [
      { label: "Không làm gì vì khách chưa để ý.", isCorrect: false },
      { label: "Nói với khách và sửa ngay trước khi thanh toán.", isCorrect: true },
      { label: "Chờ khách phàn nàn mới xử lý.", isCorrect: false },
      { label: "Báo quản lý xử lý sau.", isCorrect: false },
    ],
    explanation: "Tính chính xác và chủ động xử lý sai sót ngay lập tức là dấu hiệu của sự chuyên nghiệp.",
  },
  {
    id: 13, category: "dedicated", points: 5,
    customerEmoji: "😔",
    situation: "Khách trông mệt mỏi và lo lắng sau một ngày dài.",
    question: "Bạn làm gì thêm?",
    choices: [
      { label: "Làm việc bình thường, không chú ý.", isCorrect: false },
      { label: "Hỏi thêm để biết vấn đề.", isCorrect: false },
      { label: 'Mỉm cười ấm áp, phục vụ nhẹ nhàng và nói: "Chúc Anh/Chị buổi tối tốt lành ạ."', isCorrect: true },
      { label: 'Nói: "Trông Anh/Chị có vẻ mệt nhỉ?"', isCorrect: false },
    ],
    explanation: "Đôi khi một nụ cười và lời chúc chân thành là điều duy nhất khách cần sau một ngày vất vả.",
  },
  {
    id: 14, category: "friendly", points: 5,
    customerEmoji: "🏷️",
    situation: 'Khách hỏi: "Sản phẩm này có đang giảm giá không?"',
    question: "Bạn trả lời thế nào khi không chắc?",
    choices: [
      { label: '"Không giảm đâu."', isCorrect: false },
      { label: '"Không biết."', isCorrect: false },
      { label: '"Em chưa chắc ạ, để em kiểm tra nhanh hoặc hỏi đồng nghiệp cho Anh/Chị nhé."', isCorrect: true },
      { label: "Im lặng và tiếp tục quét hàng.", isCorrect: false },
    ],
    explanation: "Không chắc thì hỏi, đừng phán đoán sai. Sự thành thật và chủ động tìm thông tin được khách đánh giá cao.",
  },
  {
    id: 15, category: "proficient", points: 5,
    customerEmoji: "💰",
    situation: "Khách đưa tiền mặt và không đủ tiền lẻ để trả lại đúng.",
    question: "Bạn làm gì?",
    choices: [
      { label: 'Nói: "Không có tiền lẻ, Anh/Chị chịu đi."', isCorrect: false },
      { label: "Báo tình huống với quản lý hoặc hỏi đồng nghiệp đổi tiền lẻ.", isCorrect: true },
      { label: "Làm tròn số và giữ phần lẻ.", isCorrect: false },
      { label: "Bỏ qua và không hoàn trả.", isCorrect: false },
    ],
    explanation: "Xử lý đúng tiền mặt và luôn đảm bảo trả lại đúng số tiền là yêu cầu cơ bản của sự thành thạo.",
  },
  {
    id: 16, category: "dedicated", points: 5,
    customerEmoji: "📦",
    situation: "Khách mua hàng nặng (nước, gạo, dầu ăn) rất nhiều.",
    question: "Bạn làm gì khi quét xong?",
    choices: [
      { label: "Chờ khách tự bê đi.", isCorrect: false },
      { label: 'Hỏi: "Anh/Chị có cần em gọi bảo vệ hỗ trợ mang hàng ra xe không ạ?"', isCorrect: true },
      { label: '"Hàng nặng vậy mà mua nhiều vậy."', isCorrect: false },
      { label: "Đề nghị khách quay lại lần sau để mua ít hơn.", isCorrect: false },
    ],
    explanation: "Chủ động hỏi và kết nối khách với sự hỗ trợ phù hợp là biểu hiện của sự tận tâm.",
  },
  {
    id: 17, category: "friendly", points: 5,
    customerEmoji: "👔",
    situation: "Khách VIP cầm thẻ thành viên Mcard hạng cao.",
    question: "Bạn phục vụ thế nào?",
    choices: [
      { label: "Xử lý như khách bình thường.", isCorrect: false },
      { label: "Nhận diện hạng thành viên, chào hỏi thân thiện và cảm ơn sự tin tưởng của khách.", isCorrect: true },
      { label: "Chỉ quan tâm đến thẻ để tính điểm.", isCorrect: false },
      { label: '"Thẻ VIP thì được ưu tiên quầy khác."', isCorrect: false },
    ],
    explanation: "Khách VIP xứng đáng được nhận biết và phục vụ với thái độ trân trọng đặc biệt.",
  },
  {
    id: 18, category: "proficient", points: 5,
    customerEmoji: "🖥️",
    situation: "Máy POS bị lỗi giữa chừng khi khách đang thanh toán.",
    question: "Bạn làm gì?",
    choices: [
      { label: "Bảo khách đợi rồi tự mình loay hoay sửa.", isCorrect: false },
      { label: "Xin lỗi khách, thông báo tình huống và nhanh chóng gọi kỹ thuật/quản lý hỗ trợ.", isCorrect: true },
      { label: '"Máy hỏng rồi, Anh/Chị thanh toán tiền mặt đi."', isCorrect: false },
      { label: "Tắt máy rồi khởi động lại mà không báo ai.", isCorrect: false },
    ],
    explanation: "Xử lý sự cố nhanh gọn, minh bạch, và biết khi nào cần nhờ hỗ trợ là kỹ năng quan trọng.",
  },
  {
    id: 19, category: "dedicated", points: 5,
    customerEmoji: "🧒",
    situation: "Trẻ em đi cùng bố mẹ, tò mò nhìn quầy thu ngân.",
    question: "Bạn làm gì?",
    choices: [
      { label: "Tập trung vào bố/mẹ, không để ý bé.", isCorrect: false },
      { label: 'Mỉm cười với bé, nói: "Bé ngoan quá!" nếu phù hợp.', isCorrect: true },
      { label: "Nhờ bố/mẹ giữ bé ra xa quầy.", isCorrect: false },
      { label: "Bỏ qua, tập trung vào giao dịch.", isCorrect: false },
    ],
    explanation: "Quan tâm đến toàn bộ gia đình (kể cả bé) tạo ra trải nghiệm ấm áp và đáng nhớ.",
  },
  {
    id: 20, category: "friendly", points: 5,
    customerEmoji: "🛍️",
    situation: "Khách ra về sau khi thanh toán xong.",
    question: "Lời nào kết thúc giao dịch tốt nhất?",
    choices: [
      { label: "Không nói gì, chuẩn bị cho khách tiếp theo.", isCorrect: false },
      { label: '"Tiếp theo."', isCorrect: false },
      { label: '"Cảm ơn Anh/Chị đã mua sắm tại MM. Chúc Anh/Chị một ngày vui vẻ!"', isCorrect: true },
      { label: '"Hóa đơn Anh/Chị đây."', isCorrect: false },
    ],
    explanation: "Lời tạm biệt chân thành là ấn tượng cuối cùng — khách nhớ cảm giác ra về, không chỉ nhớ sản phẩm.",
  },
];

type QCState = {
  phase: "intro" | "playing" | "results";
  questions: Question[];
  currentIndex: number;
  answers: (boolean | "timeout")[];
  streak: number;
  maxStreak: number;
  timeLeft: number;
  showFeedback: boolean;
  selectedChoiceIndex: number | null;
  lastCorrect: boolean | null;
};

const TIME_PER_QUESTION = 15;

const shuffleQuestions = () => {
  return [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
};

export default function QuickChallenge() {
  const { correct, wrong, gameComplete } = useSoundEffects();

  const [state, setState] = useState<QCState>({
    phase: "intro",
    questions: [],
    currentIndex: 0,
    answers: [],
    streak: 0,
    maxStreak: 0,
    timeLeft: TIME_PER_QUESTION,
    showFeedback: false,
    selectedChoiceIndex: null,
    lastCorrect: null,
  });

  const handleStart = () => {
    setState({
      phase: "playing",
      questions: shuffleQuestions(),
      currentIndex: 0,
      answers: [],
      streak: 0,
      maxStreak: 0,
      timeLeft: TIME_PER_QUESTION,
      showFeedback: false,
      selectedChoiceIndex: null,
      lastCorrect: null,
    });
  };

  const handleNext = (newState: QCState) => {
    if (newState.currentIndex < 9) {
      setState({
        ...newState,
        currentIndex: newState.currentIndex + 1,
        timeLeft: TIME_PER_QUESTION,
        showFeedback: false,
        selectedChoiceIndex: null,
        lastCorrect: null,
      });
    } else {
      gameComplete();
      setState({
        ...newState,
        phase: "results",
      });
    }
  };

  const handleAnswer = (isCorrect: boolean, choiceIndex?: number) => {
    if (state.showFeedback || state.phase !== "playing") return;

    if (isCorrect) correct();
    else wrong();

    const isTimeout = choiceIndex === undefined;
    const newStreak = isCorrect ? state.streak + 1 : 0;
    
    const newState: QCState = {
      ...state,
      answers: [...state.answers, isTimeout ? "timeout" : isCorrect],
      streak: newStreak,
      maxStreak: Math.max(state.maxStreak, newStreak),
      showFeedback: true,
      selectedChoiceIndex: choiceIndex ?? null,
      lastCorrect: isCorrect,
    };

    setState(newState);

    setTimeout(() => {
      handleNext(newState);
    }, 800);
  };

  useEffect(() => {
    if (state.phase !== "playing" || state.showFeedback) return;

    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          setTimeout(() => handleAnswer(false), 0);
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.phase, state.showFeedback, state.currentIndex]);

  const renderIntro = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center max-w-md mx-auto"
    >
      <Link href="/" className="absolute top-6 left-6 text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </Link>
      
      <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-100/50">
        <Zap className="w-12 h-12" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-primary mb-3">Thử Thách Nhanh</h1>
      <p className="text-lg text-muted-foreground mb-8">
        10 câu hỏi ngẫu nhiên • 15 giây mỗi câu • Không chơi lại
      </p>

      <div className="flex gap-2 mb-10">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Thân thiện</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Thành thạo</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">Tận tâm</span>
      </div>

      <Button onClick={handleStart} size="lg" className="w-full h-14 text-lg font-bold rounded-xl shadow-md hover:scale-[1.02] transition-transform">
        Bắt Đầu Ngay
      </Button>
    </motion.div>
  );

  const renderPlaying = () => {
    const question = state.questions[state.currentIndex];
    
    // Timer styling logic
    const percentage = (state.timeLeft / TIME_PER_QUESTION) * 100;
    const isWarning = state.timeLeft <= 7 && state.timeLeft > 4;
    const isDanger = state.timeLeft <= 4;
    
    const timerColor = isDanger 
      ? "text-red-500" 
      : isWarning 
        ? "text-yellow-500" 
        : "text-green-500";
        
    const timerBg = isDanger 
      ? "stroke-red-100" 
      : isWarning 
        ? "stroke-yellow-100" 
        : "stroke-green-100";

    const getCategoryDetails = (cat: string) => {
      switch(cat) {
        case "friendly": return { name: "Thân thiện", color: "bg-green-100 text-green-700" };
        case "proficient": return { name: "Thành thạo", color: "bg-blue-100 text-blue-700" };
        case "dedicated": return { name: "Tận tâm", color: "bg-purple-100 text-purple-700" };
        default: return { name: "", color: "" };
      }
    };
    
    const catDetails = getCategoryDetails(question.category);

    return (
      <div className="flex flex-col min-h-[100dvh] max-w-md mx-auto p-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="font-bold text-muted-foreground">
            Câu {state.currentIndex + 1}/10
          </div>
          <div className="flex items-center gap-3">
            {state.streak >= 3 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-full text-sm"
              >
                <Flame className="w-4 h-4 fill-orange-500" />
                {state.streak}
              </motion.div>
            )}
            <span className={cn("px-3 py-1 rounded-full text-xs font-bold", catDetails.color)}>
              {catDetails.name}
            </span>
          </div>
        </div>

        {/* Circular Timer */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                className={cn("fill-none stroke-[6]", timerBg)}
              />
              <motion.circle
                cx="48"
                cy="48"
                r="44"
                className={cn("fill-none stroke-[6] stroke-current transition-colors duration-300", timerColor)}
                strokeDasharray={2 * Math.PI * 44}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 44 * (1 - percentage / 100)
                }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            <div className={cn("absolute text-3xl font-black transition-colors duration-300", timerColor)}>
              {state.timeLeft}
            </div>
          </div>
        </div>

        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex flex-col items-center mb-8 text-center">
              <motion.div 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-7xl mb-4"
              >
                {question.customerEmoji}
              </motion.div>
              <p className="text-muted-foreground mb-2 text-sm">{question.situation}</p>
              <h2 className="text-xl font-bold text-foreground">{question.question}</h2>
            </div>

            {/* Choices */}
            <div className="space-y-3 mt-auto mb-4">
              {question.choices.map((choice, idx) => {
                let btnClass = "border-border hover:bg-muted/50";
                
                if (state.showFeedback) {
                  if (choice.isCorrect) {
                    btnClass = "border-green-500 bg-green-50 text-green-700";
                  } else if (state.selectedChoiceIndex === idx && !choice.isCorrect) {
                    btnClass = "border-red-500 bg-red-50 text-red-700";
                  } else {
                    btnClass = "opacity-50";
                  }
                }

                return (
                  <Button
                    key={idx}
                    variant="outline"
                    className={cn(
                      "w-full h-auto min-h-14 py-3 px-4 text-left justify-start text-base whitespace-normal rounded-xl transition-all duration-200",
                      btnClass
                    )}
                    onClick={() => handleAnswer(choice.isCorrect, idx)}
                    disabled={state.showFeedback}
                  >
                    {choice.label}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Timeout Indicator */}
        <AnimatePresence>
          {state.showFeedback && state.selectedChoiceIndex === null && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <Clock className="w-5 h-5" /> Hết giờ!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderResults = () => {
    const correctCount = state.answers.filter(a => a === true).length;
    const totalPoints = correctCount * 5;
    
    // Breakdown
    const categoryStats = {
      friendly: { total: 0, correct: 0 },
      proficient: { total: 0, correct: 0 },
      dedicated: { total: 0, correct: 0 }
    };
    
    state.questions.forEach((q, idx) => {
      const cat = q.category;
      categoryStats[cat].total++;
      if (state.answers[idx] === true) categoryStats[cat].correct++;
    });

    let message = "";
    if (correctCount <= 4) message = "Đừng nản! Hãy luyện tập thêm nhé.";
    else if (correctCount <= 7) message = "Tiến bộ tốt! Tiếp tục cố gắng.";
    else if (correctCount <= 9) message = "Gần hoàn hảo! Bạn rất giỏi.";
    else message = "Tuyệt vời! Bạn là chuyên gia 3T!";

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center min-h-[100dvh] p-6 max-w-md mx-auto"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 mt-8">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-foreground mb-2 text-center">Kết Quả Thử Thách</h1>
        <p className="text-primary font-bold text-xl mb-6">{message}</p>

        <div className="bg-card w-full rounded-3xl border border-border p-6 shadow-sm mb-8 space-y-6">
          <div className="flex justify-between items-end border-b border-border pb-6">
            <div>
              <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-1">ĐIỂM SỐ</div>
              <div className="text-5xl font-black text-primary">{totalPoints}<span className="text-2xl text-muted-foreground">/50</span></div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground font-semibold mb-1">CHÍNH XÁC</div>
              <div className="text-2xl font-bold">{correctCount}/10</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-orange-500 font-bold mb-4">
              <Flame className="w-5 h-5 fill-orange-500" />
              Chuỗi dài nhất: {state.maxStreak}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-green-500" /> Thân thiện</span>
                <span className="font-bold">{categoryStats.friendly.correct}/{categoryStats.friendly.total}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Thành thạo</span>
                <span className="font-bold">{categoryStats.proficient.correct}/{categoryStats.proficient.total}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><HeartHandshake className="w-4 h-4 text-purple-500" /> Tận tâm</span>
                <span className="font-bold">{categoryStats.dedicated.correct}/{categoryStats.dedicated.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-3 mt-auto mb-4">
          <Button onClick={handleStart} size="lg" className="w-full h-14 text-lg font-bold rounded-xl">
            Chơi lại
          </Button>
          <Link href="/" className="w-full block">
            <Button variant="outline" size="lg" className="w-full h-14 text-lg font-bold rounded-xl">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-background min-h-[100dvh] font-sans selection:bg-primary/20">
      {state.phase === "intro" && renderIntro()}
      {state.phase === "playing" && renderPlaying()}
      {state.phase === "results" && renderResults()}
    </div>
  );
}