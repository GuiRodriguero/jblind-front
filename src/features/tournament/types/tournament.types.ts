export interface TournamentLevel {
  id: string;
  round: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  duration: number; // minutes
  isBreak: boolean;
}
