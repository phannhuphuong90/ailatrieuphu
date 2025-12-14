import React, { useState, useEffect, useCallback } from 'react';
import { Question, MONEY_LEVELS, Lifelines as LifelinesType } from '../types';
import MoneyTree from './MoneyTree';
import Lifelines from './Lifelines';
import { audioService } from '../services/audioService';
import { askAudienceSimulation, phoneAFriendSimulation } from '../services/geminiService';

interface GameScreenProps {
  questions: Question[];
  onGameOver: (level: number, reason: string) => void;
  onVictory: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

const GameScreen: React.FC<GameScreenProps> = ({ questions, onGameOver, onVictory }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false); // Locked in, waiting for reveal
  const [showCorrect, setShowCorrect] = useState(false); // Reveal correct answer
  
  const [lifelines, setLifelines] = useState<LifelinesType>({
    fiftyFifty: true,
    phoneFriend: true,
    askAudience: true
  });
  
  const [hiddenAnswers, setHiddenAnswers] = useState<number[]>([]);
  const [modalMessage, setModalMessage] = useState<React.ReactNode | null>(null);

  const currentQuestion = questions[currentLevel];

  // Sound effects for new question
  useEffect(() => {
    // Reset state for new question
    setSelectedAnswer(null);
    setIsLocked(false);
    setShowCorrect(false);
    setHiddenAnswers([]);
    setModalMessage(null);
  }, [currentLevel]);

  const handleSelectAnswer = (index: number) => {
    if (isLocked || showCorrect) return;
    audioService.playSelect();
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || isLocked) return;
    
    setIsLocked(true);
    audioService.playLockIn();

    // Suspense delay
    setTimeout(() => {
      setShowCorrect(true);
      
      const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
      
      if (isCorrect) {
        audioService.playCorrect();
        // Delay before moving to next question
        setTimeout(() => {
          if (currentLevel === questions.length - 1) {
            onVictory();
          } else {
            setCurrentLevel(prev => prev + 1);
          }
        }, 2000);
      } else {
        audioService.playWrong();
        // Delay before game over
        setTimeout(() => {
          onGameOver(currentLevel, `Rất tiếc! Đáp án đúng là ${LETTERS[currentQuestion.correctAnswerIndex]}.`);
        }, 2500);
      }
    }, 2000); // 2s suspense
  };

  const useLifeline = async (type: keyof LifelinesType) => {
    if (!lifelines[type] || isLocked) return;

    setLifelines(prev => ({ ...prev, [type]: false }));
    audioService.playSelect();

    if (type === 'fiftyFifty') {
      const wrongIndices = [0, 1, 2, 3].filter(i => i !== currentQuestion.correctAnswerIndex);
      // Remove 2 random wrong answers
      const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
      setHiddenAnswers(shuffled.slice(0, 2));
    }

    if (type === 'askAudience') {
        const percentages = await askAudienceSimulation(currentQuestion);
        setModalMessage(
            <div className="bg-blue-900 border-2 border-yellow-500 p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl text-yellow-400 font-bold mb-4 text-center">Khán giả trường quay</h3>
                <div className="flex justify-around items-end h-40 gap-4">
                    {percentages.map((p, i) => (
                        <div key={i} className="flex flex-col items-center w-full">
                            <span className="text-white text-xs mb-1">{p}%</span>
                            <div 
                                className="w-full bg-yellow-500 transition-all duration-1000" 
                                style={{ height: `${p}%` }}
                            ></div>
                            <span className="text-yellow-400 font-bold mt-2">{LETTERS[i]}</span>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={() => setModalMessage(null)}
                    className="mt-6 w-full py-2 bg-blue-700 hover:bg-blue-600 rounded text-white font-bold"
                >
                    Đóng
                </button>
            </div>
        );
    }

    if (type === 'phoneFriend') {
        const message = await phoneAFriendSimulation(currentQuestion);
        setModalMessage(
             <div className="bg-blue-900 border-2 border-yellow-500 p-6 rounded-lg max-w-md w-full text-center">
                <h3 className="text-xl text-yellow-400 font-bold mb-4">Gọi điện thoại người thân</h3>
                <div className="text-lg text-white mb-6 italic">
                    {message}
                </div>
                <button 
                    onClick={() => setModalMessage(null)}
                    className="mt-2 w-full py-2 bg-blue-700 hover:bg-blue-600 rounded text-white font-bold"
                >
                    Cảm ơn
                </button>
            </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-vtv">
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 relative">
        
        {/* Lifelines */}
        <div className="w-full mt-2">
           <Lifelines lifelines={lifelines} onUse={useLifeline} disabled={isLocked} />
        </div>

        {/* Question Area */}
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center mb-8">
            
            {/* Question Box */}
            <div className="mb-8 relative">
                <div className="bg-black border-2 border-blue-400 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_20px_rgba(59,130,246,0.5)] min-h-[120px] flex items-center justify-center">
                    <h2 className="text-xl md:text-3xl font-bold text-white">
                        {currentQuestion.question}
                    </h2>
                </div>
                {/* Connector lines (decorative) */}
                <div className="absolute top-1/2 -left-4 w-4 h-0.5 bg-blue-400"></div>
                <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-blue-400"></div>
            </div>

            {/* Answers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {currentQuestion.answers.map((ans, idx) => {
                    if (hiddenAnswers.includes(idx)) {
                        return <div key={idx} className="h-16 md:h-20 opacity-0"></div>;
                    }

                    let btnClass = "bg-slate-900 border-blue-500 text-white hover:bg-blue-900";
                    
                    if (isLocked) {
                        if (showCorrect) {
                            if (idx === currentQuestion.correctAnswerIndex) {
                                btnClass = "bg-green-600 border-white text-white animate-correct shadow-[0_0_20px_rgba(34,197,94,0.8)]";
                            } else if (idx === selectedAnswer) {
                                btnClass = "bg-red-600 border-white text-white shadow-[0_0_20px_rgba(220,38,38,0.8)]";
                            }
                        } else if (idx === selectedAnswer) {
                            btnClass = "bg-orange-600 border-white text-white animate-blink shadow-[0_0_20px_rgba(249,115,22,0.8)]";
                        }
                    } else if (idx === selectedAnswer) {
                         btnClass = "bg-orange-500 border-yellow-400 text-white";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelectAnswer(idx)}
                            disabled={isLocked}
                            className={`
                                relative group hex-btn border-2 h-16 md:h-20 px-8 flex items-center transition-all duration-200
                                ${btnClass}
                            `}
                        >
                            <span className="text-yellow-500 font-bold mr-3 text-lg md:text-2xl">{LETTERS[idx]}:</span>
                            <span className="text-sm md:text-xl font-medium text-left flex-1">{ans}</span>
                        </button>
                    );
                })}
            </div>
        </div>
        
        {/* Confirm Button (Only visible when selected) */}
        <div className="h-16">
            {!isLocked && selectedAnswer !== null && (
                 <button 
                    onClick={handleConfirmAnswer}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-8 rounded-full text-xl shadow-lg animate-bounce"
                 >
                    CHỐT ĐÁP ÁN
                 </button>
            )}
        </div>

      </div>

      {/* Money Tree Sidebar */}
      <MoneyTree currentLevel={currentLevel} />

      {/* Modal Overlay */}
      {modalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            {modalMessage}
        </div>
      )}
    </div>
  );
};

export default GameScreen;