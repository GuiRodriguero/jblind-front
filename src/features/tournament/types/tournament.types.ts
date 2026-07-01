export interface TournamentLevel {
  id: string;
  round: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  duration: number; // minutes
  isBreak: boolean;
  shouldColorUp?: boolean;
}

export interface TournamentPlayer {
  id: string;
  name: string;
}

export const PrizeMode = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
} as const;

export type PrizeMode = (typeof PrizeMode)[keyof typeof PrizeMode];

export interface PrizePayout {
  id: string;
  position: number;
  value: number;
  percentage: number;
}

export interface PrizeSettings {
  mode: PrizeMode;
  payouts: PrizePayout[];
}
