import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import * as React from 'react';
import { Modal } from '../../../components/ui/Modal';

interface AddPlayerModalProps {
  onClose: () => void;
  onConfirm: (name: string, buyIn: number) => void;
  minBuyIn?: number;
  maxBuyIn?: number;
}

export function AddPlayerModal({ onClose, onConfirm, minBuyIn, maxBuyIn }: AddPlayerModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [buyIn, setBuyIn] = useState('');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = Number(buyIn) || 0;

    if ((amount < minBuyIn!) || (amount > maxBuyIn!)) {
      alert(t('cashgame.active.modals.addPlayer.error', { min: minBuyIn as number, max: maxBuyIn as number }));
      return;
    }

    if (name.trim()) {
      onConfirm(name, amount);
      onClose();
    }
  };

  return (
    <Modal>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center text-green-400">
          <UserPlus size={20} />
        </div>
        <h3 className="text-xl font-bold text-white">{t('cashgame.active.modals.addPlayer.title')}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            {t('cashgame.active.modals.addPlayer.name')}
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
            placeholder={t('cashgame.active.modals.addPlayer.namePlaceholder')}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            {t('cashgame.active.modals.addPlayer.buyIn')}
          </label>
          <input
            type="number"
            value={buyIn}
            onChange={(e) => setBuyIn(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
            placeholder="0.00"
            step="0.01"
            min={minBuyIn}
            max={maxBuyIn}
          />
          {(minBuyIn !== undefined || maxBuyIn !== undefined) && (
            <p className="mt-1.5 text-[10px] text-gray-500 italic">
              {minBuyIn !== undefined && maxBuyIn !== undefined 
                ? t('cashgame.active.modals.addPlayer.limitBoth', { min: minBuyIn as number, max: maxBuyIn as number })
                : minBuyIn !== undefined 
                  ? t('cashgame.active.modals.addPlayer.limitMin', { min: minBuyIn as number })
                  : t('cashgame.active.modals.addPlayer.limitMax', { max: maxBuyIn as number })
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
            className="flex-1 px-4 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20"
          >
            {t('cashgame.active.modals.confirm')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
