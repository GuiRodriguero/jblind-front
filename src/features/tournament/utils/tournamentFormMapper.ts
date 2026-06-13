import type { TournamentFormData } from '../components/TournamentGeneralSettings';
import type { TournamentLevel } from '../types/tournament.types';

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

interface ApiTournament {
  readonly name: string;
  readonly scheduledAt: string;
  readonly expectedPlayers: number;
  readonly buyIn: number;
  readonly startingStack: number;
  readonly allowRebuys: boolean;
  readonly allowAddOn: boolean;
  readonly levels: ApiTournamentLevel[];
}

export const EMPTY_TOURNAMENT_FORM_DATA: TournamentFormData = {
  name: '',
  date: '',
  time: '',
  expectedPlayers: '',
  buyIn: '',
  startingStack: '',
  allowRebuys: false,
  allowAddOn: false,
};

export function buildTournamentPayload(formData: TournamentFormData, levels: TournamentLevel[]) {
  return {
    name: formData.name,
    scheduledAt: `${formData.date}T${formData.time}:00`,
    expectedPlayers: Number(formData.expectedPlayers),
    buyIn: Number(formData.buyIn),
    startingStack: Number(formData.startingStack),
    allowRebuys: formData.allowRebuys ?? false,
    allowAddOn: formData.allowAddOn ?? false,
    levels: levels.map((level) => ({
      roundNumber: level.round,
      smallBlind: level.smallBlind,
      bigBlind: level.bigBlind,
      ante: level.ante,
      durationInMinutes: level.duration,
      isBreak: level.isBreak,
      shouldColorUp: level.shouldColorUp,
    })),
  };
}

export function mapTournamentToFormState(tournament: ApiTournament): {
  formData: TournamentFormData;
  levels: TournamentLevel[];
} {
  const [date = '', timeWithSeconds = ''] = tournament.scheduledAt.split('T');
  const [hours = '', minutes = ''] = timeWithSeconds.split(':');

  return {
    formData: {
      name: tournament.name,
      date,
      time: `${hours}:${minutes}`,
      expectedPlayers: String(tournament.expectedPlayers),
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
      duration: level.durationInMinutes,
      isBreak: level.isBreak,
      shouldColorUp: level.shouldColorUp,
    })),
  };
}