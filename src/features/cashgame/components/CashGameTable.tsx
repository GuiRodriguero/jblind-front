import { CircleDollarSign, DollarSign, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cashGameApi } from '../services/cashGameApi';
import { CashGameActionsMenu } from './CashGameActionsMenu';

interface CashGameSummary {
  readonly id: string;
  readonly name: string;
  readonly smallBlind: number;
  readonly bigBlind: number;
  readonly minBuyIn: number;
  readonly maxBuyIn: number;
  readonly players: number;
  readonly status: string;
}

export function CashGameTable() {
  const { t } = useTranslation();

  const [cashGames, setCashGames] = useState<CashGameSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCashGames() {
      try {
        const data = await cashGameApi.findAll();
        setCashGames(data);
      } catch (error) {
        console.error('Error trying to search cash games.', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCashGames();
  }, []);

  const handlePlayClick = async (e: React.MouseEvent, id: string, status: string) => {
    e.stopPropagation();

    if (status === 'FINISHED') {
      window.location.assign(`/cashgames/summary?cashgameid=${id}`);
      return;
    }

    try {
      await cashGameApi.play(id);
      window.location.assign(`/cashgames/timer?cashgameid=${id}`);
    } catch (error) {
      console.error('Error trying to start the cash game.', error);
    }
  };

  const handleCashGameDeleted = (cashGameId: string) => {
    setCashGames((currentCashGames) =>
      currentCashGames.filter((cashGame) => cashGame.id !== cashGameId)
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
              <th className="p-4 font-medium">{t('cashgame.table.name')}</th>
              <th className="p-4 font-medium">{t('cashgame.table.blinds')}</th>
              <th className="p-4 font-medium">{t('cashgame.table.buyIn')}</th>
              <th className="p-4 font-medium">{t('cashgame.table.players')}</th>
              <th className="p-4 font-medium text-center">{t('cashgame.table.action')}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {cashGames.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                  {t('cashgame.table.empty')}
                </td>
              </tr>
            ) : (
              cashGames.map((cgItem) => (
                <tr
                  key={cgItem.id}
                  onClick={(e) => handlePlayClick(e, cgItem.id, cgItem.status)}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4 font-semibold text-white">
                    {cgItem.name}
                    <span className="block text-xs font-normal text-gray-500 mt-1">{cgItem.status}</span>
                  </td>
                  <td className="p-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign size={14} className="text-gray-500" />
                      {cgItem.smallBlind} / {cgItem.bigBlind}
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">
                    <div className="flex items-center gap-1 text-green-400 font-medium">
                      <DollarSign size={14} />
                      {cgItem.minBuyIn} - {cgItem.maxBuyIn}
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gray-500" />
                      {cgItem.players}
                    </div>
                  </td>
                  <td className="p-4">
                    <CashGameActionsMenu
                      cashGame={{ id: cgItem.id, name: cgItem.name, status: cgItem.status }}
                      onPlay={handlePlayClick}
                      onDeleted={handleCashGameDeleted}
                    />
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}
