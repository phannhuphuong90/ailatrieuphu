import React, { useState } from 'react';
import { GameState, Question } from './types';
import { generateGameQuestions } from './services/geminiService';
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [finalLevel, setFinalLevel] = useState(0);
  const [endMessage, setEndMessage] = useState("");

  const startGame = async () => {
    setIsLoading(true);
    // Request questions from Gemini
    const qs = await generateGameQuestions();
    setQuestions(qs);
    setIsLoading(false);
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (level: number, reason: string) => {
    setFinalLevel(level);
    setEndMessage(reason);
    setGameState(GameState.GAME_OVER);
  };

  const handleVictory = () => {
    setFinalLevel(14);
    setEndMessage("Bạn đã trả lời đúng tất cả 15 câu hỏi. Bạn là TRIỆU PHÚ!");
    setGameState(GameState.VICTORY);
  };

  const restartGame = () => {
    setGameState(GameState.INTRO);
    setQuestions([]);
  };

  return (
    <div className="font-sans text-white h-screen overflow-hidden">
      {gameState === GameState.INTRO && (
        <IntroScreen onStart={startGame} loading={isLoading} />
      )}

      {gameState === GameState.PLAYING && (
        <GameScreen 
          questions={questions} 
          onGameOver={handleGameOver}
          onVictory={handleVictory}
        />
      )}

      {(gameState === GameState.GAME_OVER || gameState === GameState.VICTORY) && (
        <ResultScreen 
          level={finalLevel} 
          message={endMessage}
          isVictory={gameState === GameState.VICTORY}
          onRestart={restartGame}
        />
      )}
    </div>
  );
};

export default App;