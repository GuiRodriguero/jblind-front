import { Calendar, DollarSign, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../utils/DateUtils';
import { TournamentActionsMenu } from './TournamentActionsMenu';

interface TournamentSummary {
  readonly id: number;
  readonly name: string;
  readonly scheduledAt: string;
  readonly expectedPlayers: number;
  readonly buyIn: number;
  readonly status: string;
}

export function TournamentTable() {
  const { t } = useTranslation();

  const [tournaments, setTournaments] = useState<TournamentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const response = await fetch('http://localhost:8080/v1/tournaments');
        if (response.ok) {
          const data = await response.json();
          setTournaments(data);
        } else {
          console.error('Error trying to search tournaments.');
        }
      } catch (error) {
        console.error('Error connecting with server.', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTournaments();
  }, []);

  const handlePlayClick = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    try {
      const response = await fetch(`http://localhost:8080/v1/tournaments/${id}/play`, {
        method: 'POST'
      });

      if (response.ok) {
        window.location.assign(`/timer?tournamentId=${id}`);
      } else {
        console.error('Error trying to start the tournament.');
      }
    } catch (error) {
      console.error('Error trying to communicate with server.', error);
    }
  };

  const handleTournamentDeleted = (tournamentId: number) => {
    setTournaments((currentTournaments) =>
      currentTournaments.filter((tournament) => tournament.id !== tournamentId)
    );
  };

  if (loading) {
    return (
      <div className="bg-surface border border-white/10 rounded-xl p-8 text-center text-gray-400">
        {t('default.loading')}
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface border border-white/10 rounded-xl overflow-hidden flex flex-col w-full shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
            <tr className="bg-surface-light border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
              <th className="p-4 font-medium">{t('tournament.table.name')}</th>
              <th className="p-4 font-medium">{t('tournament.table.dateTime')}</th>
              <th className="p-4 font-medium">{t('tournament.table.players')}</th>
              <th className="p-4 font-medium">{t('tournament.table.buyIn')}</th>
              <th className="p-4 font-medium text-center">{t('tournament.table.action')}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {tournaments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                  {t('tournament.table.empty')}
                </td>
              </tr>
            ) : (
              tournaments.map((tItem) => {
                const { date, time } = formatDateTime(tItem.scheduledAt);

                return (
                  <tr
                    key={tItem.id}
                    onClick={(e) => handlePlayClick(e, tItem.id)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-semibold text-white">
                      {tItem.name}
                      <span className="block text-xs font-normal text-gray-500 mt-1">{tItem.status}</span>
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        {date} - {time}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-500" />
                        {tItem.expectedPlayers}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-1 text-green-400 font-medium">
                        <DollarSign size={14} />
                        {tItem.buyIn}
                      </div>
                    </td>
                    <td className="p-4">
                      <TournamentActionsMenu
                        tournament={{ id: tItem.id, name: tItem.name }}
                        onPlay={handlePlayClick}
                        onDeleted={handleTournamentDeleted}
                      />
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}
