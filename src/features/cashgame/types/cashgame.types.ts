export interface CashGamePlayer {
  id: string;
  name: string;
  buyIn: number;
}

export interface CashGameActivePlayer {
  id: number | string;
  name: string;
  totalInvested: number;
  currentStack: number;
  cashedOutValue: number | null;
  isActive: boolean;
  profit: number;
}

export const CashGameLogType = {
  JOIN: 'join',
  REBUY: 'rebuy',
  ADDON: 'addon',
  CASHOUT: 'cashout',
  INFO: 'info',
} as const;

export type CashGameLogType = (typeof CashGameLogType)[keyof typeof CashGameLogType];

export interface CashGameLog {
  id: string;
  timestamp: string;
  type: CashGameLogType;
  message: string;
}