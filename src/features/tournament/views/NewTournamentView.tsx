import { useState } from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LevelStructureManager } from '../components/LevelStructureManager';
import { TournamentGeneralSettings, type TournamentFormData } from '../components/TournamentGeneralSettings';
import type { TournamentLevel } from '../types/tournament.types';

export function NewTournamentView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [levels, setLevels] = useState<TournamentLevel[]>([]);
  const [formData, setFormData] = useState<TournamentFormData>({
    name: '',
    date: '',
    time: '',
    expectedPlayers: '',
    buyIn: '',
    startingStack: '',
    allowRebuys: false,
    allowAddOn: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    const scheduledAt = `${formData.date}T${formData.time}:00`;

    const payload = {
      name: formData.name,
      scheduledAt: scheduledAt,
      expectedPlayers: Number(formData.expectedPlayers),
      buyIn: Number(formData.buyIn),
      startingStack: Number(formData.startingStack),
      allowRebuys: formData.allowRebuys,
      allowAddOn: formData.allowAddOn,
      levels: levels.map((l) => ({
        roundNumber: l.round,
        smallBlind: l.smallBlind,
        bigBlind: l.bigBlind,
        ante: l.ante,
        durationInMinutes: l.duration,
        isBreak: l.isBreak,
      })),
    };

    try {
      const response = await fetch('http://localhost:8080/v1/tournaments/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate('/tournaments');
      } else {
        console.error('Error creating tournament', await response.json());
      }
    } catch (error) {
      console.error('Error connecting with API.', error);
    }
  };

  const stepsConfig = [
    {
      title: t('tournament.new.generalSettings.stepTitle'),
      content: <TournamentGeneralSettings formData={formData} onChange={handleInputChange} />,
      primaryAction: () => setStep(2),
      primaryLabel: t('tournament.new.next'),
      primaryIcon: <ArrowRight size={16} />,
      primaryClass: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: t('tournament.new.blindStructure.stepTitle'),
      content: (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <LevelStructureManager levels={levels} onLevelsChange={setLevels} />
        </div>
      ),
      primaryAction: handleSave,
      primaryLabel: t('tournament.new.save'),
      primaryIcon: <Save size={16} />,
      primaryClass: 'bg-green-600 hover:bg-green-700',
    },
  ];

  const currentStep = stepsConfig[step - 1];

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
          <p className="text-sm text-gray-400">{currentStep.title}</p>
        </div>
      </div>

      <div className="flex-1 bg-surface border border-white/10 rounded-2xl p-8 shadow-xl">{currentStep.content}</div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => navigate('/tournaments')}
          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          {t('default.cancel')}
        </button>

        <button
          onClick={currentStep.primaryAction}
          className={`${currentStep.primaryClass} text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all`}
        >
          {currentStep.primaryLabel} {currentStep.primaryIcon}
        </button>
      </div>
    </div>
  );
}
