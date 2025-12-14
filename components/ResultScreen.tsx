import React from 'react';
import { MONEY_LEVELS, IMPORTANT_LEVELS } from '../types';

interface ResultScreenProps {
  level: number;
  message: string;
  isVictory: boolean;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ level, message, isVictory, onRestart }) => {
  // Calculate prize money based on safety nets (milestones)
  let prizeIndex = -1;
  if (isVictory) {
      prizeIndex = 14;
  } else {
      // Find the highest safety net reached
      for (let i = IMPORTANT_LEVELS.length - 1; i >= 0; i--) {
          if (level > IMPORTANT_LEVELS[i]) {
              prizeIndex = IMPORTANT_LEVELS[i];
              break;
          }
      }
  }
  
  const prizeMoney = prizeIndex >= 0 ? MONEY_LEVELS[prizeIndex] : "0";

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-vtv p-4 text-center">
      <div className="max-w-2xl w-full bg-slate-900/90 border-4 border-yellow-600 p-8 rounded-3xl shadow-[0_0_50px_rgba(202,138,4,0.3)]">
        
        <h2 className={`text-4xl md:text-6xl font-black mb-6 ${isVictory ? 'text-green-500' : 'text-red-500'}`}>
          {isVictory ? 'CHÚC MỪNG!' : 'CUỘC CHƠI DỪNG LẠI'}
        </h2>
        
        <p className="text-xl text-blue-200 mb-8 font-medium">
          {message}
        </p>

        <div className="bg-black/50 p-6 rounded-xl border border-blue-500/30 mb-8">
          <p className="text-gray-400 uppercase text-sm tracking-widest mb-2">Tiền thưởng của bạn</p>
          <p className="text-4xl md:text-5xl font-bold text-yellow-400 drop-shadow-md">
            {prizeMoney} VNĐ
          </p>
        </div>

        <button
          onClick={onRestart}
          className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full text-xl transition-transform hover:scale-105 shadow-lg"
        >
          Chơi Lại
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;