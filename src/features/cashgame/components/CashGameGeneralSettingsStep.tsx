import { Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as React from 'react';

export interface CashGameFormData {
  readonly name: string;
  readonly date: string;
  readonly time: string;
  readonly smallBlind: string;
  readonly bigBlind: string;
  readonly minBuyIn: string;
  readonly maxBuyIn: string;
}

interface CashGameGeneralSettingsProps {
  readonly formData: CashGameFormData;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CashGameGeneralSettingsStep({ formData, onChange }: CashGameGeneralSettingsProps) {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 text-blue-400 mb-6 border-b border-white/10 pb-4">
        <Settings2 size={18} />
        <h2 className="font-bold uppercase tracking-widest text-xs">{t('cashgame.new.generalSettingsTitle')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('cashgame.new.name')}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder={t('cashgame.new.placeholder.name')}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('cashgame.new.date')}</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 scheme-dark"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('cashgame.new.time')}</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={onChange}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 scheme-dark"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('cashgame.new.smallBlind')}</label>
          <input
            type="number"
            name="smallBlind"
            value={formData.smallBlind}
            onChange={onChange}
            placeholder={t('cashgame.new.placeholder.smallBlind')}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('cashgame.new.bigBlind')}</label>
          <input
            type="number"
            name="bigBlind"
            value={formData.bigBlind}
            onChange={onChange}
            placeholder={t('cashgame.new.placeholder.bigBlind')}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('cashgame.new.minBuyIn')}</label>
          <input
            type="number"
            name="minBuyIn"
            value={formData.minBuyIn}
            onChange={onChange}
            placeholder={t('cashgame.new.placeholder.minBuyIn')}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('cashgame.new.maxBuyIn')}</label>
          <input
            type="number"
            name="maxBuyIn"
            value={formData.maxBuyIn}
            onChange={onChange}
            placeholder={t('cashgame.new.placeholder.maxBuyIn')}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
