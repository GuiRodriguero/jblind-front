import { DollarSign, LogOut, PlusCircle, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CashGameActivePlayer } from '../types/cashgame.types';
import type { ActionType } from './CashGameActionModal';

interface CashGamePlayerRowProps {
  player: CashGameActivePlayer;
  onAction: (type: ActionType) => void;
}

export function CashGamePlayerRow({ player, onAction }: CashGamePlayerRowProps) {
  const { t } = useTranslation();
  const isFirstBuyIn = player.totalInvested === 0;

  return (
    <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl border border-white/5">
      <div className="flex gap-6 items-center">
        <div>
          <p className="font-bold text-white">{player.name}</p>
          <p className="text-[10px] text-gray-500 uppercase">
            {t('cashgame.active.ledger.invested')}: <span className="text-gray-300 font-mono">R$ {player.totalInvested.toFixed(2)}</span>
          </p>
        </div>

        <div 
          className="cursor-pointer hover:bg-white/5 px-2 py-1 rounded transition-colors"
          onClick={() => onAction('stack')}
        >
          <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
            <Coins size={10} /> {t('cashgame.active.ledger.current')}
          </p>
          <p className={`font-mono text-sm font-bold ${player.currentStack > player.totalInvested ? 'text-green-400' : 'text-white'}`}>
            R$ {player.currentStack.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onAction(isFirstBuyIn ? 'buyIn' : 'rebuy')}
          title={t(`cashgame.active.ledger.${isFirstBuyIn ? 'buyIn' : 'rebuy'}`)}
          className="flex items-center gap-1 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
        >
          <DollarSign size={14} /> <span className="hidden md:inline">{t(`cashgame.active.ledger.${isFirstBuyIn ? 'buyIn' : 'rebuy'}`)}</span>
        </button>

        {!isFirstBuyIn && (
          <button
            onClick={() => onAction('addon')}
            title={t('cashgame.active.ledger.addon')}
            className="flex items-center gap-1 bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            <PlusCircle size={14} /> <span className="hidden md:inline">{t('cashgame.active.ledger.addon')}</span>
          </button>
        )}

        <button
          onClick={() => onAction('cashout')}
          title={t('cashgame.active.ledger.cashout')}
          className="flex items-center gap-1 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
        >
          <LogOut size={14} /> <span className="hidden md:inline">{t('cashgame.active.ledger.cashout')}</span>
        </button>
      </div>
    </div>
  );
}
