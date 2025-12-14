import React, { useEffect } from 'react';
import { audioService } from '../services/audioService';

interface IntroScreenProps {
  onStart: () => void;
  loading: boolean;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart, loading }) => {
  useEffect(() => {
    // Play sound on mount (user interaction required first usually, but we try)
    const handleInteract = () => audioService.playIntro();
    window.addEventListener('click', handleInteract, { once: true });
    return () => window.removeEventListener('click', handleInteract);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-vtv relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-300 rounded-full opacity-50"></div>
      </div>

      <div className="z-10 text-center space-y-8 animate-fade-in-up">
        <div className="mb-8 relative">
          <div className="w-48 h-48 mx-auto bg-blue-900 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.6)]">
            <span className="text-6xl font-black text-yellow-400 select-none">?</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mt-6 tracking-wider drop-shadow-lg">
            AI LÀ TRIỆU PHÚ
          </h1>
          <h2 className="text-xl md:text-2xl text-blue-200 mt-2 font-bold uppercase tracking-widest">
            Phiên bản Hóa Học 6 - Cánh Diều
          </h2>
        </div>

        <button
          onClick={onStart}
          disabled={loading}
          className={`
            relative px-12 py-4 text-2xl font-bold uppercase tracking-wider text-white 
            bg-gradient-to-r from-blue-600 to-blue-800 
            border-2 border-blue-400 rounded-full 
            shadow-[0_0_20px_rgba(37,99,235,0.5)] 
            transition-all duration-300 transform 
            hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.8)] hover:from-blue-500 hover:to-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tải dữ liệu...
            </span>
          ) : (
            "Bắt đầu ngay"
          )}
        </button>
      </div>
      
      <div className="absolute bottom-8 text-blue-400/60 text-sm">
        Sử dụng Gemini AI để tạo câu hỏi
      </div>
    </div>
  );
};

export default IntroScreen;