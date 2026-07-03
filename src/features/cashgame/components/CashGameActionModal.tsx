import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, LogOut, Coins, PlusCircle } from 'lucide-react';
import * as React from 'react';
import { Modal } from '../../../components/ui/Modal';

export type ActionType = 'rebuy' | 'buyIn' | 'addon' | 'cashout' | 'stack';

const ACTION_CONFIG = {
  buyIn: {
    icon: DollarSign,
    colorClass: 'bg-blue-600/20 text-blue-400',
    buttonClass: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20',
  },
  rebuy: {
    icon: DollarSign,
    colorClass: 'bg-blue-600/20 text-blue-400',
    buttonClass: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20',
  },
  addon: {
    icon: PlusCircle,
    colorClass: 'bg-purple-600/20 text-purple-400',
    buttonClass: 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20',
  },
  cashout: {
    icon: LogOut,
    colorClass: 'bg-red-600/20 text-red-400',
    buttonClass: 'bg-red-600 hover:bg-red-500 shadow-red-900/20',
  },
  stack: {
    icon: Coins,
    colorClass: 'bg-amber-600/20 text-amber-400',
    buttonClass: 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20',
  },
};

interface CashGameActionModalProps {
  type: ActionType;
  playerName: string;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  minBuyIn?: number;
  maxBuyIn?: number;
}

export function CashGameActionModal({ 
  type, 
  playerName, 
  onClose, 
  onConfirm,
  minBuyIn,
  maxBuyIn
}: CashGameActionModalProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');

  const config = ACTION_CONFIG[type];
  const Icon = config.icon;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = Number(amount);

    if (type === 'buyIn' || type === 'rebuy') {
      if (val < minBuyIn! || val > maxBuyIn!) {
        alert(t('cashgame.active.modals.buyIn.error', { min: minBuyIn as number, max: maxBuyIn as number }));
        return;
      }
    }

    if (!isNaN(val) && (type === 'cashout' || type === 'stack' || val > 0)) {
      onConfirm(val);
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.colorClass}`}>
          <Icon size={20} />
        </div>
        <h3 className="text-xl font-bold text-white">
          {t(`cashgame.active.modals.${type}.title`, { name: playerName })}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            {t(`cashgame.active.modals.${type}.amount`)}
          </label>
          <input
            autoFocus
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
            placeholder="0.00"
            step="0.01"
            required
            min={(type === 'buyIn' || type === 'rebuy') ? minBuyIn : undefined}
            max={(type === 'buyIn' || type === 'rebuy') ? maxBuyIn : undefined}
          />
          {(type === 'buyIn' || type === 'rebuy') && (minBuyIn !== undefined || maxBuyIn !== undefined) && (
            <p className="mt-1.5 text-[10px] text-gray-500 italic">
              {minBuyIn !== undefined && maxBuyIn !== undefined 
                ? t('cashgame.active.modals.buyIn.limitBoth', { min: minBuyIn as number, max: maxBuyIn as number })
                : minBuyIn !== undefined 
                  ? t('cashgame.active.modals.buyIn.limitMin', { min: minBuyIn as number })
                  : t('cashgame.active.modals.buyIn.limitMax', { max: maxBuyIn as number })
              }
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
          >
            {t('default.cancel')}
          </button>
          <button
            type="submit"
            className={`flex-1 px-4 py-3 rounded-xl text-white font-bold transition-colors shadow-lg ${config.buttonClass}`}
          >
            {t('cashgame.active.modals.confirm')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
