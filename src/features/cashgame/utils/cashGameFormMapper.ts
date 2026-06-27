import type { CashGameFormData } from '../components/CashGameGeneralSettingsStep.tsx';
import type { CashGamePlayer } from '../types/cashgame.types';

interface ApiCashGamePlayer {
  readonly id?: string | number;
  readonly name: string;
  readonly buyIn: number;
}

interface ApiCashGame {
  readonly name: string;
  readonly scheduledAt: string;
  readonly smallBlind: number;
  readonly bigBlind: number;
  readonly minBuyIn: number;
  readonly maxBuyIn: number;
  readonly players?: ApiCashGamePlayer[];
}

export const EMPTY_CASH_GAME_FORM_DATA: CashGameFormData = {
  name: '',
  date: '',
  time: '',
  smallBlind: '',
  bigBlind: '',
  minBuyIn: '',
  maxBuyIn: '',
};

export const EMPTY_CASH_GAME_PLAYERS: CashGamePlayer[] = [];

export function buildCashGamePayload(
  formData: CashGameFormData,
  players: CashGamePlayer[] = EMPTY_CASH_GAME_PLAYERS,
) {
  return {
    name: formData.name,
    scheduledAt: `${formData.date}T${formData.time}:00`,
    smallBlind: Number(formData.smallBlind),
    bigBlind: Number(formData.bigBlind),
    minBuyIn: Number(formData.minBuyIn),
    maxBuyIn: Number(formData.maxBuyIn),
    players: players.map((player) => ({ name: player.name, buyIn: player.buyIn })),
  };
}

export function mapCashGameToFormState(cashGame: ApiCashGame): {
  formData: CashGameFormData;
  players: CashGamePlayer[];
} {
  const [date = '', timeWithSeconds = ''] = cashGame.scheduledAt.split('T');
  const [hours = '', minutes = ''] = timeWithSeconds.split(':');

  return {
    formData: {
      name: cashGame.name,
      date,
      time: `${hours}:${minutes}`,
      smallBlind: String(cashGame.smallBlind),
      bigBlind: String(cashGame.bigBlind),
      minBuyIn: String(cashGame.minBuyIn),
      maxBuyIn: String(cashGame.maxBuyIn),
    },
    players: (cashGame.players ?? []).map((player) => ({
      id: String(player.id ?? crypto.randomUUID()),
      name: player.name,
      buyIn: player.buyIn,
    })),
  };
}
