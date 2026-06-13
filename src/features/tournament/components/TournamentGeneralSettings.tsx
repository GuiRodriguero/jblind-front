import { Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as React from 'react';

export interface TournamentFormData {
  readonly name: string;
  readonly date: string;
  readonly time: string;
  readonly expectedPlayers: string;
  readonly buyIn: string;
  readonly startingStack: string;
  readonly allowRebuys: boolean;
  readonly allowAddOn: boolean;
}

interface TournamentGeneralSettingsProps {
  readonly formData: TournamentFormData;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TournamentGeneralSettings({ formData, onChange }: TournamentGeneralSettingsProps) {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 text-blue-400 mb-6 border-b border-white/10 pb-4">
        <Settings2 size={18} />
        <h2 className="font-bold uppercase tracking-widest text-xs">{t('tournament.new.generalSettingsTitle')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.name')}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder={t('tournament.new.placeholder.name')}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.date')}</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={onChange}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 scheme-dark"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.time')}</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={onChange}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 scheme-dark"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.expectedPlayers')}</label>
          <input
            type="number"
            name="expectedPlayers"
            value={formData.expectedPlayers}
            onChange={onChange}
            placeholder={t('tournament.new.placeholder.players')}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.buyInAmount')}</label>
          <input
            type="number"
            name="buyIn"
            value={formData.buyIn}
            onChange={onChange}
            placeholder={t('tournament.new.placeholder.buyIn')}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.startingChips')}</label>
          <input
            type="number"
            name="startingStack"
            value={formData.startingStack}
            onChange={onChange}
            placeholder={t('tournament.new.placeholder.startingChips')}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2 flex gap-8 p-4 bg-surface-light rounded-lg border border-white/5 mt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="allowRebuys"
              checked={formData.allowRebuys}
              onChange={onChange}
              className="w-5 h-5 rounded border-white/10 bg-[#0a0a0a] text-blue-500 focus:ring-blue-500 focus:ring-offset-surface-light"
            />
            <span className="text-sm font-medium text-gray-300">{t('tournament.new.allowRebuys')}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="allowAddOn"
              checked={formData.allowAddOn}
              onChange={onChange}
              className="w-5 h-5 rounded border-white/10 bg-[#0a0a0a] text-blue-500 focus:ring-blue-500 focus:ring-offset-surface-light"
            />
            <span className="text-sm font-medium text-gray-300">{t('tournament.new.allowAddOns')}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
