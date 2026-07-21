import type { TournamentFormData } from '../components/TournamentGeneralSettingsStep.tsx';
import { PrizeMode, type PrizeSettings, type TournamentLevel, type TournamentPlayer } from '../types/tournament.types';

interface ApiTournamentLevel {
  readonly id?: string | number;
  readonly roundNumber: number;
  readonly smallBlind: number;
  readonly bigBlind: number;
  readonly ante: number;
  readonly durationInMinutes: number;
  readonly isBreak: boolean;
  readonly shouldColorUp?: boolean;
}

interface ApiTournamentPlayer {
  readonly id?: string | number;
  readonly name: string;
}

interface ApiPrizePayout {
  readonly position: number;
  readonly value: number;
  readonly percentage: number;
}

interface ApiPrizeSettings {
  readonly mode: PrizeMode;
  readonly payouts: ApiPrizePayout[];
}

interface ApiTournament {
  readonly name: string;
  readonly scheduledAt: string;
  readonly expectedPlayers: number;
  readonly buyIn: number;
  readonly startingStack: number;
  readonly allowRebuys: boolean;
  readonly allowAddOn: boolean;
  readonly levels: ApiTournamentLevel[];
  readonly players?: ApiTournamentPlayer[];
  readonly prize?: ApiPrizeSettings;
}

export const EMPTY_TOURNAMENT_FORM_DATA: TournamentFormData = {
  name: '',
  date: '',
  time: '',
  buyIn: '',
  startingStack: '',
  allowRebuys: false,
  allowAddOn: false,
};

export const EMPTY_TOURNAMENT_PLAYERS: TournamentPlayer[] = [];

export const EMPTY_PRIZE_SETTINGS: PrizeSettings = {
  mode: PrizeMode.FIXED,
  payouts: [],
};

export function buildTournamentPayload(
  formData: TournamentFormData,
  levels: TournamentLevel[],
  players: TournamentPlayer[] = EMPTY_TOURNAMENT_PLAYERS,
  prizes: PrizeSettings = EMPTY_PRIZE_SETTINGS,
) {
  return {
    name: formData.name,
    scheduledAt: `${formData.date}T${formData.time}:00`,
    expectedPlayers: players.length,
    buyIn: Number(formData.buyIn),
    startingStack: Number(formData.startingStack),
    allowRebuys: formData.allowRebuys ?? false,
    allowAddOn: formData.allowAddOn ?? false,
    levels: levels.map((level) => ({
      roundNumber: level.round,
      smallBlind: level.smallBlind,
      bigBlind: level.bigBlind,
      ante: level.ante,
      durationInMinutes: level.durationInMinutes,
      isBreak: level.isBreak,
      shouldColorUp: level.shouldColorUp,
    })),
    players: players.map((player) => ({ name: player.name })),
    prize: {
      mode: prizes.mode,
      payouts: prizes.payouts.map((payout) => ({
        position: payout.position,
        value: payout.value,
        percentage: payout.percentage,
      })),
    },
  };
}

export function mapTournamentToFormState(tournament: ApiTournament): {
  formData: TournamentFormData;
  levels: TournamentLevel[];
  players: TournamentPlayer[];
  prizes: PrizeSettings;
} {
  const [date = '', timeWithSeconds = ''] = tournament.scheduledAt.split('T');
  const [hours = '', minutes = ''] = timeWithSeconds.split(':');

  return {
    formData: {
      name: tournament.name,
      date,
      time: `${hours}:${minutes}`,
      buyIn: String(tournament.buyIn),
      startingStack: String(tournament.startingStack),
      allowRebuys: tournament.allowRebuys,
      allowAddOn: tournament.allowAddOn,
    },
    levels: tournament.levels.map((level) => ({
      id: String(level.id ?? crypto.randomUUID()),
      round: level.roundNumber,
      smallBlind: level.smallBlind,
      bigBlind: level.bigBlind,
      ante: level.ante,
      durationInMinutes: level.durationInMinutes,
      isBreak: level.isBreak,
      shouldColorUp: level.shouldColorUp,
    })),
    players: (tournament.players ?? []).map((player) => ({
      id: String(player.id ?? crypto.randomUUID()),
      name: player.name,
    })),
    prizes: {
      mode: tournament.prize?.mode ?? PrizeMode.FIXED,
      payouts: (tournament.prize?.payouts ?? []).map((payout) => ({
        id: crypto.randomUUID(),
        position: payout.position,
        value: payout.value,
        percentage: payout.percentage,
      })),
    },
  };
}