export interface TournamentLevel {
  id: string;
  roundNumber: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  durationInMinutes: number;
  isBreak: boolean;
  shouldColorUp?: boolean;
}

export interface TournamentPlayer {
  id: string;
  name: string;
}

export const TournamentLogType = {
  BUY_IN: 'BUY_IN',
  REBUY: 'REBUY',
  ADD_ON: 'ADD_ON',
  ELIMINATION: 'ELIMINATION',
  LEFT: 'LEFT',
  CHAMPION: 'CHAMPION',
} as const;

export type TournamentLogType = (typeof TournamentLogType)[keyof typeof TournamentLogType];

export interface TournamentLog {
  id: string;
  tournamentId: string;
  playerId?: string;
  type: TournamentLogType;
  amount?: number;
  message: string;
  timestamp: string;
}

export const PrizeMode = {
  FIXED: 'FIXED',
  PERCENTAGE: 'PERCENTAGE',
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
