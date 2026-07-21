import { api } from '../../../lib/axios';
import { TournamentLogType } from '../types/tournament.types';

export const tournamentApi = {

  getDetails: async (tournamentId: string) => {
    const { data } = await api.get(`/v1/tournaments/${tournamentId}`);
    return data;
  },

  persistLog: async (tournamentId: string, playerId: string | null, type: TournamentLogType, amount: number, message: string) => {
    const { data } = await api.post(`/v1/tournaments/${tournamentId}/logs`, {
      tournamentPlayerId: playerId,
      type,
      amount,
      message
    });
    return data;
  }

};
