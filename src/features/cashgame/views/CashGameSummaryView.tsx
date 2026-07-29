import { ArrowLeft, TrendingUp, TrendingDown, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cashGameApi } from '../services/cashGameApi';
import { CashGameLogType } from '../types/cashgame.types';

interface CashGameSummaryLog {
  id: number | string;
  playerId: string | null;
  type: CashGameLogType;
  amount: number;
  message: string;
  timestamp: string;
}

interface CashGameSummaryDetails {
  id: string;
  name: string;
  players?: Array<{
    id: string;
    name: string;
    totalInvested: number;
    currentStack: number;
  }>;
  logs?: CashGameSummaryLog[];
}

interface PlayerResult {
  id: string;
  name: string;
  invested: number;
  cashedOut: number;
  profit: number;
}

const LOG_TYPE_COLORS: Record<string, string> = {
  [CashGameLogType.BUY_IN]: 'text-green-400',
  [CashGameLogType.REBUY]: 'text-blue-400',
  [CashGameLogType.ADD_ON]: 'text-purple-400',
  [CashGameLogType.CASHOUT]: 'text-amber-400',
};

function buildResults(details: CashGameSummaryDetails): PlayerResult[] {
  const players = details.players ?? [];
  const cashedOutMap: Record<string, number> = {};

  (details.logs ?? []).forEach((log) => {
    if (!log.playerId) return;
    if (log.type === CashGameLogType.CASHOUT) {
      cashedOutMap[log.playerId] = (cashedOutMap[log.playerId] ?? 0) + (Number(log.amount) || 0);
    }
  });

  return players
    .map((p) => {
      const invested = Number(p.totalInvested) || 0;
      const cashedOut = cashedOutMap[p.id] ?? (Number(p.currentStack) || 0);
      return {
        id: p.id,
        name: p.name,
        invested,
        cashedOut,
        profit: cashedOut - invested,
      };
    })
    .sort((a, b) => b.profit - a.profit);
}

export function CashGameSummaryView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cashGameId = searchParams.get('cashgameid');

  const [details, setDetails] = useState<CashGameSummaryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDetails() {
      if (!cashGameId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await cashGameApi.getDetails(cashGameId);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching cash game summary:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDetails();
  }, [cashGameId]);

  const results = useMemo(() => (details ? buildResults(details) : []), [details]);

  const sortedLogs = useMemo(
    () =>
      [...(details?.logs ?? [])].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    [details]
  );

  if (isLoading) return <div className="p-8 text-white">{t('cashgame.summary.loading')}</div>;
  if (!details) return <div className="p-8 text-white">{t('cashgame.summary.notFound')}</div>;

  return (
    <div className="min-h-full flex flex-col p-6 gap-6">
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => navigate('/cashgames')}
          className="p-2 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white rounded-full transition-all"
          title={t('cashgame.summary.back')}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">{t('cashgame.summary.title')}</h1>
          <p className="text-sm text-gray-400">{details.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-12 xl:col-span-7 bg-surface border border-white/10 rounded-2xl p-4 flex flex-col">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 shrink-0">
            {t('cashgame.summary.standings')}
          </h2>
          <div className="space-y-2">
            {results.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  player.profit > 0
                    ? 'bg-green-900/10 border-green-500/20'
                    : player.profit < 0
                      ? 'bg-red-900/10 border-red-500/20'
                      : 'bg-gray-800/50 border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono w-6">{index + 1}.</span>
                  {index === 0 ? <Trophy className="text-amber-400" size={16} /> : null}
                  <span className="font-bold text-white">{player.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`font-black flex items-center gap-1 ${
                      player.profit > 0 ? 'text-green-400' : player.profit < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}
                  >
                    {player.profit > 0 ? <TrendingUp size={14} /> : player.profit < 0 ? <TrendingDown size={14} /> : null}
                    {player.profit > 0 ? '+' : ''}
                    {player.profit.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    ({t('cashgame.summary.invested')}: {player.invested.toFixed(0)} | {t('cashgame.summary.cashedOut')}:{' '}
                    {player.cashedOut.toFixed(0)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col xl:h-full min-h-0">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 shrink-0">
            {t('cashgame.summary.logsTitle')}
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {sortedLogs.length === 0 ? (
              <p className="text-center text-sm text-gray-600 mt-10">{t('cashgame.summary.logsEmpty')}</p>
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
