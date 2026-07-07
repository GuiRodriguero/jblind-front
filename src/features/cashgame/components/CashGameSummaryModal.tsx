import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CashGameActivePlayer } from '../types/cashgame.types';
import { Modal } from '../../../components/ui/Modal.tsx';

interface CashGameSummaryModalProps {
  readonly isOpen: boolean;
  readonly players: CashGameActivePlayer[];
  readonly onFinish: () => void;
}

export function CashGameSummaryModal({ isOpen, players, onFinish }: CashGameSummaryModalProps) {
  const { t } = useTranslation();
  const sortedPlayers = [...players].sort((a, b) => b.profit - a.profit);

  return (
    <Modal isOpen={isOpen} maxWidth="max-w-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center py-4 bg-green-500/10 rounded-xl border border-green-500/20 mb-4">
          <Trophy className="text-green-400 mr-2" size={24} />
          <h2 className="text-lg font-bold text-green-400 uppercase tracking-widest">{t('cashgame.active.summary.title')}</h2>
        </div>

        <div className="space-y-2">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                player.profit > 0 ? 'bg-green-900/10 border-green-500/20' :
                  player.profit < 0 ? 'bg-red-900/10 border-red-500/20' :
                    'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-mono w-4">{index + 1}.</span>
                <span className="font-bold text-white">{player.name}</span>
              </div>

              <div className="flex flex-col items-end">
                <span className={`font-black flex items-center gap-1 ${
                  player.profit > 0 ? 'text-green-400' :
                    player.profit < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {player.profit > 0 ? <TrendingUp size={14}/> : player.profit < 0 ? <TrendingDown size={14}/> : null}
                  {player.profit > 0 ? '+' : ''}{player.profit.toFixed(2)}
                </span>
                <span className="text-[10px] text-gray-500">
                  ({t('cashgame.active.summary.investedShort')}: {player.totalInvested.toFixed(0)} | {t('cashgame.active.summary.cashedOutShort')}: {player.cashedOutValue?.toFixed(0)})
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onFinish}
          className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors"
        >
          {t('cashgame.active.summary.finish')}
        </button>
      </div>
    </Modal>
  );
}