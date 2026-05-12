import { Play, Calendar, Users, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const MOCK_TOURNAMENTS = [
  { id: '1', name: 'Home Game Friday', date: '15 Mai 2026', time: '20:00', players: 8, buyIn: 50, status: 'Scheduled' },
  { id: '2', name: 'Birthday Special', date: '22 Mai 2026', time: '16:00', players: 18, buyIn: 20, status: 'Draft' },
];

export function TournamentTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handlePlayClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/timer?tournamentId=${id}`);
  };

  return (
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
            {MOCK_TOURNAMENTS.map((r) => (
              <tr
                key={r.id}
                onClick={(e) => handlePlayClick(e, r.id)}
                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <td className="p-4 font-semibold text-white">
                  {r.name}
                  <span className="block text-xs font-normal text-gray-500 mt-1">{r.status}</span>
                </td>
                <td className="p-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    {r.date} às {r.time}
                  </div>
                </td>
                <td className="p-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-500" />
                    {r.players}
                  </div>
                </td>
                <td className="p-4 text-gray-300">
                  <div className="flex items-center gap-1 text-green-400 font-medium">
                    <DollarSign size={14} />
                    {r.buyIn}
                  </div>
                </td>
                <td className="p-4 flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => handlePlayClick(e, r.id)}
                    className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-all group-hover:scale-110"
                    title="Start Tournament"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
