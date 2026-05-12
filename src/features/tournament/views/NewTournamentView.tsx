import { useState } from 'react';
import { ArrowLeft, ArrowRight, Settings2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LevelStructureManager } from '../components/LevelStructureManager';
import type { TournamentLevel } from '../types/Tournament.types';
import { useTranslation } from 'react-i18next';

export function NewTournamentView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [levels, setLevels] = useState<TournamentLevel[]>([]);

  const handleSave = () => {
    const payload = {
      blindStructure: levels,
    };
    console.log('Enviando para o Backend:', payload);
  };

  return (
    <div className="p-8 h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('tournament.new.create')}</h1>
          <p className="text-sm text-gray-400">
            {step === 1 ? 'Step 1: General Details & Buy-in' : 'Step 2: Blind Structure'}
          </p>
        </div>
      </div>

      <div className="flex-1 bg-surface border border-white/10 rounded-2xl p-8 shadow-xl">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 text-blue-400 mb-6 border-b border-white/10 pb-4">
              <Settings2 size={18} />
              <h2 className="font-bold uppercase tracking-widest text-xs">
                {t('tournament.new.generalSettingsTitle')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.name')}</label>
                <input
                  type="text"
                  placeholder={t('tournament.new.placeholder.name')}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.date')}</label>
                  <input
                    type="date"
                    className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.time')}</label>
                  <input
                    type="time"
                    className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.expectedPlayers')}</label>
                <input
                  type="number"
                  placeholder={t('tournament.new.placeholder.players')}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.buyInAmount')}</label>
                <input
                  type="number"
                  placeholder={t('tournament.new.placeholder.buyIn')}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-400 ml-1">{t('tournament.new.startingChips')}</label>
                <input
                  type="number"
                  placeholder={t('tournament.new.placeholder.startingChips')}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2 flex gap-8 p-4 bg-surface-light rounded-lg border border-white/5 mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-white/10 bg-[#0a0a0a] text-blue-500 focus:ring-blue-500 focus:ring-offset-surface-light"
                  />
                  <span className="text-sm font-medium text-gray-300">{t('tournament.new.allowRebuys')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-white/10 bg-[#0a0a0a] text-blue-500 focus:ring-blue-500 focus:ring-offset-surface-light"
                  />
                  <span className="text-sm font-medium text-gray-300">{t('tournament.new.allowAddOns')}</span>
                </label>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <LevelStructureManager levels={levels} onLevelsChange={setLevels} />
          </div>
        )}{' '}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => navigate('/tournaments')}
          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          {t('default.cancel')}
        </button>

        {step === 1 ? (
          <button
            onClick={() => setStep(2)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            {t('tournament.new.next')} <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <Save size={16} /> {t('tournament.new.save')}
          </button>
        )}
      </div>
    </div>
  );
}
