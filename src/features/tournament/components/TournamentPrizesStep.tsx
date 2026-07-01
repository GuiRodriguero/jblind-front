import { Trophy, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PrizeMode, type PrizeSettings } from '../types/tournament.types';

interface TournamentPrizesProps {
  readonly prizes: PrizeSettings;
  readonly onPrizesChange: (prizes: PrizeSettings) => void;
  readonly prizePool: number;
}

const round = (value: number) => Math.round(value * 100) / 100;

export function TournamentPrizesStep({ prizes, onPrizesChange, prizePool }: TournamentPrizesProps) {
  const { t } = useTranslation();

  const isPercentage = prizes.mode === PrizeMode.PERCENTAGE;

  const setMode = (mode: PrizeMode) => {
    if (mode === prizes.mode) {
      return;
    }

    const payouts = prizes.payouts.map((payout) => {
      if (mode === PrizeMode.FIXED) {
        return { ...payout, value: round((payout.percentage / 100) * prizePool) };
      }
      return { ...payout, percentage: prizePool > 0 ? round((payout.value / prizePool) * 100) : 0 };
    });

    onPrizesChange({ ...prizes, mode, payouts });
  };

  const addPayout = () => {
    const nextPosition = prizes.payouts.length + 1;
    onPrizesChange({
      ...prizes,
      payouts: [...prizes.payouts, { id: crypto.randomUUID(), position: nextPosition, value: 0, percentage: 0 }],
    });
  };

  const updatePayout = (id: string, rawValue: number) => {
    const safeRaw = Number.isFinite(rawValue) ? Math.max(rawValue, 0) : 0;

    const othersTotal = prizes.payouts
      .filter((payout) => payout.id !== id)
      .reduce((sum, payout) => sum + (isPercentage ? payout.percentage : payout.value), 0);

    const max = isPercentage ? Math.max(100 - othersTotal, 0) : Math.max(prizePool - othersTotal, 0);
    const clamped = round(Math.min(safeRaw, max));

    const value = isPercentage ? round((clamped / 100) * prizePool) : clamped;
    const percentage = isPercentage ? clamped : prizePool > 0 ? round((clamped / prizePool) * 100) : 0;

    onPrizesChange({
      ...prizes,
      payouts: prizes.payouts.map((payout) => (payout.id === id ? { ...payout, value, percentage } : payout)),
    });
  };

  const removePayout = (id: string) => {
    onPrizesChange({
      ...prizes,
      payouts: prizes.payouts
        .filter((payout) => payout.id !== id)
        .map((payout, index) => ({ ...payout, position: index + 1 })),
    });
  };

  const total = round(
    prizes.payouts.reduce((sum, payout) => sum + ((isPercentage ? payout.percentage : payout.value) || 0), 0),
  );
  const limit = isPercentage ? 100 : prizePool;
  const remaining = round(limit - total);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 text-blue-400 mb-6 border-b border-white/10 pb-4">
        <Trophy size={18} />
        <h2 className="font-bold uppercase tracking-widest text-xs">{t('tournament.new.prizes.title')}</h2>
      </div>

      <div className="flex items-center justify-between mb-6 p-4 bg-surface-light rounded-lg border border-white/5">
        <span className="text-sm font-medium text-gray-400">{t('tournament.new.prizes.pool')}</span>
        <span className="text-sm font-bold text-gray-200">R$ {round(prizePool)}</span>
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.prizes.mode')}</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode(PrizeMode.FIXED)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              !isPercentage ? 'bg-blue-600 text-white' : 'bg-surface-light text-gray-400 hover:text-white'
            }`}
          >
            {t('tournament.new.prizes.fixed')}
          </button>
          <button
            onClick={() => setMode(PrizeMode.PERCENTAGE)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              isPercentage ? 'bg-blue-600 text-white' : 'bg-surface-light text-gray-400 hover:text-white'
            }`}
          >
            {t('tournament.new.prizes.percentage')}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {prizes.payouts.map((payout) => (
          <div key={payout.id} className="flex items-center gap-3">
            <span className="w-20 text-sm font-bold text-gray-400">
              {t('tournament.new.prizes.position', { position: payout.position })}
            </span>
            <div className="relative flex-1">
              {!isPercentage && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
              )}
              <input
                type="number"
                min={0}
                max={isPercentage ? 100 : prizePool}
                value={isPercentage ? payout.percentage : payout.value}
                onChange={(e) => updatePayout(payout.id, Number(e.target.value))}
                className={`w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2 text-white outline-none focus:border-blue-500 ${
                  isPercentage ? 'px-3 pr-8' : 'pl-9 pr-3'
                }`}
              />
              {isPercentage && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
              )}
            </div>
            <button
              onClick={() => removePayout(payout.id)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              aria-label={t('tournament.new.prizes.remove')}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {prizes.payouts.length === 0 && (
          <div className="p-10 text-center text-gray-600 text-sm italic">{t('tournament.new.prizes.empty')}</div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={addPayout}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={14} /> {t('tournament.new.prizes.addPayout')}
        </button>

        {prizes.payouts.length > 0 && (
          <div className="flex flex-col items-end">
            <span
              className={`text-sm font-bold ${remaining < 0 ? 'text-red-500' : 'text-gray-300'}`}
            >
              {t('tournament.new.prizes.total')}: {isPercentage ? `${total}%` : `R$ ${total}`}
            </span>
            <span className="text-xs text-gray-500">
              {t('tournament.new.prizes.remaining')}: {isPercentage ? `${remaining}%` : `R$ ${remaining}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
