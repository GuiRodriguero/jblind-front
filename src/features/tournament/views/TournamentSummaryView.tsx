import { ArrowLeft, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tournamentApi } from '../services/tournamentApi';
import { TournamentLogType, type TournamentLog } from '../types/tournament.types';

interface TournamentSummaryDetails {
  id: string;
  name: string;
  players?: Array<{ id: string; name: string }>;
  logs?: TournamentLog[];
  prize?: {
    payouts: Array<{ position: number; value: number; percentage: number }>;
  };
}

interface FinalStanding {
  id: string;
  name: string;
  position: number;
  rebuys: number;
  addons: number;
  eliminated: boolean;
}

const LOG_TYPE_COLORS: Record<string, string> = {
  [TournamentLogType.BUY_IN]: 'text-green-400',
  [TournamentLogType.REBUY]: 'text-blue-400',
  [TournamentLogType.ADD_ON]: 'text-purple-400',
  [TournamentLogType.ELIMINATION]: 'text-green-400',
  [TournamentLogType.LEFT]: 'text-red-400',
  [TournamentLogType.CHAMPION]: 'text-amber-400',
};

function buildStandings(details: TournamentSummaryDetails): FinalStanding[] {
  const players = details.players ?? [];
  const stats: Record<string, { rebuys: number; addons: number; eliminatedAt: number | null }> = {};

  players.forEach((p) => {
    stats[p.id] = { rebuys: 0, addons: 0, eliminatedAt: null };
  });

  const sortedLogs = [...(details.logs ?? [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  sortedLogs.forEach((log) => {
    if (!log.playerId || !stats[log.playerId]) return;
    const s = stats[log.playerId];
    switch (log.type) {
      case TournamentLogType.REBUY:
        s.rebuys += 1;
        s.eliminatedAt = null;
        break;
      case TournamentLogType.ADD_ON:
        s.addons += 1;
        break;
      case TournamentLogType.ELIMINATION:
      case TournamentLogType.LEFT:
        s.eliminatedAt = new Date(log.timestamp).getTime();
        break;
    }
  });

  const survivors = players.filter((p) => stats[p.id].eliminatedAt === null);
  const eliminated = players
    .filter((p) => stats[p.id].eliminatedAt !== null)
    .sort((a, b) => (stats[b.id].eliminatedAt ?? 0) - (stats[a.id].eliminatedAt ?? 0));

  const ordered = [...survivors, ...eliminated];

  return ordered.map((p, index) => ({
    id: p.id,
    name: p.name,
    position: index + 1,
    rebuys: stats[p.id].rebuys,
    addons: stats[p.id].addons,
    eliminated: stats[p.id].eliminatedAt !== null,
  }));
}

export function TournamentSummaryView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');

  const [details, setDetails] = useState<TournamentSummaryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDetails() {
      if (!tournamentId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await tournamentApi.getDetails(tournamentId);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching tournament summary:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDetails();
  }, [tournamentId]);

  const standings = useMemo(() => (details ? buildStandings(details) : []), [details]);

  const sortedLogs = useMemo(
    () =>
      [...(details?.logs ?? [])].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    [details]
  );

  const payoutByPosition = useMemo(() => {
    const map: Record<number, number> = {};
    (details?.prize?.payouts ?? []).forEach((p) => {
      map[p.position] = p.value;
    });
    return map;
  }, [details]);

  if (isLoading) return <div className="p-8 text-white">{t('tournament.summary.loading')}</div>;
  if (!details) return <div className="p-8 text-white">{t('tournament.summary.notFound')}</div>;

  return (
    <div className="min-h-full flex flex-col p-6 gap-6">
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => navigate('/tournaments')}
          className="p-2 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white rounded-full transition-all"
          title={t('tournament.summary.back')}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">{t('tournament.summary.title')}</h1>
          <p className="text-sm text-gray-400">{details.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-12 xl:col-span-7 bg-surface border border-white/10 rounded-2xl p-4 flex flex-col">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 shrink-0">
            {t('tournament.summary.standings')}
          </h2>
          <div className="space-y-2">
            {standings.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  player.position === 1
                    ? 'bg-amber-900/10 border-amber-500/30'
                    : 'bg-gray-800/40 border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono w-6">{player.position}.</span>
                  {player.position === 1 ? <Trophy className="text-amber-400" size={16} /> : null}
                  <span className="font-bold text-white">{player.name}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    {(player.position !== 1 && player.eliminated) && t('tournament.summary.eliminated')}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  {payoutByPosition[player.position] ? (
                    <span className="text-green-400 font-bold text-sm">
                      {t('tournament.summary.prize')}: {payoutByPosition[player.position]}
                    </span>
                  ) : null}
                  <span className="text-[10px] text-gray-500">
                    {t('tournament.summary.rebuys')}: {player.rebuys} | {t('tournament.summary.addons')}: {player.addons}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col xl:h-full min-h-0">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 shrink-0">
            {t('tournament.summary.logsTitle')}
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {sortedLogs.length === 0 ? (
              <p className="text-center text-sm text-gray-600 mt-10">{t('tournament.summary.logsEmpty')}</p>
            ) : (
              sortedLogs.map((log) => (
                <div key={log.id} className="flex gap-3 text-sm">
                  <span className="text-gray-500 font-mono shrink-0">
                    [{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                  </span>
                  <span className={LOG_TYPE_COLORS[log.type] || 'text-white'}>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
