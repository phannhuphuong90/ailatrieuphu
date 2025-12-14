import React from 'react';
import { MONEY_LEVELS, IMPORTANT_LEVELS } from '../types';

interface MoneyTreeProps {
  currentLevel: number;
}

const MoneyTree: React.FC<MoneyTreeProps> = ({ currentLevel }) => {
  return (
    <div className="bg-black/80 border-l-2 border-yellow-600/30 w-full md:w-64 flex flex-col-reverse justify-end md:justify-center py-4 px-2 overflow-y-auto md:h-full max-h-48 md:max-h-full scrollbar-thin scrollbar-thumb-yellow-600/50">
      {MONEY_LEVELS.map((money, index) => {
        const isImportant = IMPORTANT_LEVELS.includes(index);
        const isActive = index === currentLevel;
        const isPassed = index < currentLevel;

        return (
          <div
            key={index}
            className={`
              flex justify-between items-center px-2 py-1 mb-0.5 rounded
              text-sm md:text-base transition-colors duration-300
              ${isActive ? 'bg-yellow-600 text-black font-bold scale-105 origin-left' : ''}
              ${isPassed ? 'text-green-500' : 'text-orange-300'}
              ${isImportant && !isActive ? 'text-white font-bold' : ''}
            `}
          >
            <span className="w-6 md:w-8 text-right mr-2">{index + 1}</span>
            <span className={`${isActive ? 'text-black' : isImportant ? 'text-white' : 'text-yellow-400'}`}>
              {money}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MoneyTree;