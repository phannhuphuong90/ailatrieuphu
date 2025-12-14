import React from 'react';
import { Lifelines as LifelinesType } from '../types';

interface LifelinesProps {
  lifelines: LifelinesType;
  onUse: (type: keyof LifelinesType) => void;
  disabled: boolean;
}

const Lifelines: React.FC<LifelinesProps> = ({ lifelines, onUse, disabled }) => {
  return (
    <div className="flex gap-4 mb-4 justify-center">
      {/* 50:50 */}
      <button
        onClick={() => onUse('fiftyFifty')}
        disabled={disabled || !lifelines.fiftyFifty}
        className={`
          w-16 h-10 md:w-20 md:h-14 rounded-full border-2 flex items-center justify-center font-bold transition-all
          ${!lifelines.fiftyFifty 
            ? 'border-gray-600 text-gray-600 opacity-50 cursor-not-allowed' 
            : 'border-blue-400 bg-blue-900/50 hover:bg-blue-800 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'}
        `}
        title="50:50"
      >
        50:50
      </button>

      {/* Phone a Friend */}
      <button
        onClick={() => onUse('phoneFriend')}
        disabled={disabled || !lifelines.phoneFriend}
        className={`
           w-16 h-10 md:w-20 md:h-14 rounded-full border-2 flex items-center justify-center transition-all
          ${!lifelines.phoneFriend
            ? 'border-gray-600 text-gray-600 opacity-50 cursor-not-allowed' 
            : 'border-blue-400 bg-blue-900/50 hover:bg-blue-800 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'}
        `}
        title="Gọi điện thoại cho người thân"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </button>

      {/* Ask Audience */}
      <button
        onClick={() => onUse('askAudience')}
        disabled={disabled || !lifelines.askAudience}
        className={`
           w-16 h-10 md:w-20 md:h-14 rounded-full border-2 flex items-center justify-center transition-all
          ${!lifelines.askAudience
            ? 'border-gray-600 text-gray-600 opacity-50 cursor-not-allowed' 
            : 'border-blue-400 bg-blue-900/50 hover:bg-blue-800 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'}
        `}
        title="Hỏi ý kiến khán giả"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>
    </div>
  );
};

export default Lifelines;