import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/game-context";
import { useSoundEffects } from "@/hooks/use-sound";
import { HappinessMeter } from "@/components/happiness-meter";
import { MotivationalPopup } from "@/components/motivational-popup";
import { Button } from "@/components/ui/button";

import Module1 from "./module-1";
import Module2 from "./module-2";
import Module3 from "./module-3";
import Module4 from "./module-4";
import Module5 from "./module-5";
import Module6 from "./module-6";
import { useLocation } from "wouter";

function CurrentModule({ module, onComplete }: { module: number; onComplete: () => void }) {
  switch (module) {
    case 1: return <Module1 onComplete={onComplete} />;
    case 2: return <Module2 onComplete={onComplete} />;
    case 3: return <Module3 onComplete={onComplete} />;
    case 4: return <Module4 onComplete={onComplete} />;
    case 5: return <Module5 onComplete={onComplete} />;
    case 6: return <Module6 onComplete={onComplete} />;
    default: return null;
  }
}

export default function PlayIndex() {
  const { state, nextModule } = useGame();
  const { levelComplete } = useSoundEffects();
  const [, setLocation] = useLocation();
  const [showMotivation, setShowMotivation] = useState(false);

  const handleModuleComplete = () => {
    levelComplete();
    if (state.currentModule < 6) {
      setShowMotivation(true);
    } else {
      setLocation("/results");
    }
  };

  const handleContinue = () => {
    setShowMotivation(false);
    nextModule();
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <HappinessMeter />
      
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentModule}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex-1 flex flex-col max-w-md mx-auto w-full p-4 h-full"
          >
            <div className="mb-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Thử thách {state.currentModule}/6
              </span>
            </div>
            
            <CurrentModule module={state.currentModule} onComplete={handleModuleComplete} />
            
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showMotivation && <MotivationalPopup onContinue={handleContinue} />}
      </AnimatePresence>
    </div>
  );
}
