import { useGame } from "@/lib/game-context";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export function HappinessMeter() {
  const { state } = useGame();
  
  let emoji = "😐";
  if (state.happinessPercent < 30) emoji = "😡";
  else if (state.happinessPercent < 50) emoji = "🙁";
  else if (state.happinessPercent < 75) emoji = "🙂";
  else emoji = "😍";

  let colorClass = "bg-primary";
  if (state.happinessPercent < 40) colorClass = "bg-destructive";
  else if (state.happinessPercent > 80) colorClass = "bg-success";

  return (
    <div className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-50 p-4 border-b border-border">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Mức Hài Lòng</span>
          <motion.div 
            key={emoji}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl"
          >
            {emoji}
          </motion.div>
        </div>
        <Progress value={state.happinessPercent} className="h-3" indicatorClassName={colorClass} />
        <div className="flex justify-between mt-3 text-sm font-medium text-primary">
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Thân thiện</span>
            <span>{state.friendlyScore}/30</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Thành thạo</span>
            <span>{state.proficientScore}/40</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Tận tâm</span>
            <span>{state.dedicatedScore}/30</span>
          </div>
        </div>
      </div>
    </div>
  );
}
