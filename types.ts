export enum GameState {
  INTRO = 'INTRO',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
  GAME_OVER = 'GAME_OVER',
}

export interface Question {
  question: string;
  answers: string[]; // Always 4 answers
  correctAnswerIndex: number;
  explanation?: string;
}

export interface Lifelines {
  fiftyFifty: boolean;
  phoneFriend: boolean;
  askAudience: boolean;
}

export const MONEY_LEVELS = [
  "200.000", "400.000", "600.000", "1.000.000", "2.000.000",
  "3.000.000", "6.000.000", "10.000.000", "14.000.000", "22.000.000",
  "30.000.000", "40.000.000", "60.000.000", "85.000.000", "150.000.000"
];

export const IMPORTANT_LEVELS = [4, 9, 14]; // Indices (Level 5, 10, 15)