import { api } from '../../../lib/axios';
import { CashGameLogType } from '../types/cashgame.types';

export const cashGameApi = {

  getDetails: async (cashGameId: string) => {
    const { data } = await api.get(`/v1/cashgames/${cashGameId}`);
    return data;
  },

  play: async (cashGameId: string) => {
    await api.post(`/v1/cashgames/${cashGameId}/play`);
  },

  finish: async (cashGameId: string) => {
    await api.post(`/v1/cashgames/${cashGameId}/finish`);
  },

  addPlayer: async (cashGameId: string, name: string) => {
    const { data } = await api.post(`/v1/cashgames/${cashGameId}/players`, { name });
    return data;
  },

  persistLog: async (cashGameId: string, playerId: string | number | null, type: CashGameLogType, amount: number, message: string) => {
    const { data } = await api.post(`/v1/cashgames/${cashGameId}/logs`, {
      cashGamePlayerId: playerId,
      type,
      amount,
      message
    });
    return data;
  }

};