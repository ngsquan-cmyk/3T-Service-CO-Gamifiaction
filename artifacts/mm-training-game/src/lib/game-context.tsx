import React, { createContext, useContext, useState, ReactNode } from 'react';

type GameState = {
  friendlyScore: number;
  proficientScore: number;
  dedicatedScore: number;
  happinessPercent: number;
  currentModule: number;
  paymentErrors: number;
  startTime: number | null;
  endTime: number | null;
  playerName: string;
};

type GameContextType = {
  state: GameState;
  addFriendly: (pts: number) => void;
  addProficient: (pts: number) => void;
  addDedicated: (pts: number) => void;
  adjustHappiness: (amount: number) => void;
  nextModule: () => void;
  recordPaymentError: () => void;
  startGame: () => void;
  endGame: (name: string) => void;
  resetGame: () => void;
};

const initialState: GameState = {
  friendlyScore: 0,
  proficientScore: 0,
  dedicatedScore: 0,
  happinessPercent: 50,
  currentModule: 1,
  paymentErrors: 0,
  startTime: null,
  endTime: null,
  playerName: '',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const addFriendly = (pts: number) => setState(s => ({ ...s, friendlyScore: Math.min(30, s.friendlyScore + pts) }));
  const addProficient = (pts: number) => setState(s => ({ ...s, proficientScore: Math.min(40, s.proficientScore + pts) }));
  const addDedicated = (pts: number) => setState(s => ({ ...s, dedicatedScore: Math.min(30, s.dedicatedScore + pts) }));
  
  const adjustHappiness = (amount: number) => setState(s => ({ 
    ...s, 
    happinessPercent: Math.max(0, Math.min(100, s.happinessPercent + amount)) 
  }));

  const nextModule = () => setState(s => ({ ...s, currentModule: s.currentModule + 1 }));
  const recordPaymentError = () => setState(s => ({ ...s, paymentErrors: s.paymentErrors + 1 }));
  
  const startGame = () => setState({ ...initialState, startTime: Date.now() });
  const endGame = (playerName: string) => setState(s => ({ ...s, endTime: Date.now(), playerName }));
  const resetGame = () => setState(initialState);

  return (
    <GameContext.Provider value={{
      state, addFriendly, addProficient, addDedicated, 
      adjustHappiness, nextModule, recordPaymentError, 
      startGame, endGame, resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
}
