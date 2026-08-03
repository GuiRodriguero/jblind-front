import { api } from '../../../lib/axios';
import { TournamentLogType } from '../types/tournament.types';

export const tournamentApi = {

  findAll: async () => {
    const { data } = await api.get('/v1/tournaments');
    return data;
  },

  getDetails: async (tournamentId: string) => {
    const { data } = await api.get(`/v1/tournaments/${tournamentId}`);
    return data;
  },

  play: async (tournamentId: string) => {
    await api.post(`/v1/tournaments/${tournamentId}/play`);
  },

  delete: async (tournamentId: string) => {
    await api.delete(`/v1/tournaments/${tournamentId}`);
  },

  finish: async (tournamentId: string) => {
    await api.post(`/v1/tournaments/${tournamentId}/finish`);
  },

  persistLog: async (tournamentId: string, playerId: string | null, type: TournamentLogType, amount: number, message: string, playersLeft: number) => {
    const { data } = await api.post(`/v1/tournaments/${tournamentId}/logs`, {
      tournamentPlayerId: playerId,
      type,
      amount,
      message,
      playersLeft
    });
    return data;
  }

};
