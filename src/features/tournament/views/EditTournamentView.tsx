import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { TournamentLevelStructureManagerStep } from '../components/TournamentLevelStructureManagerStep.tsx';
import { TournamentGeneralSettingsStep, type TournamentFormData } from '../components/TournamentGeneralSettingsStep.tsx';
import { TournamentPlayersStep } from '../components/TournamentPlayersStep.tsx';
import { TournamentPrizesStep } from '../components/TournamentPrizesStep.tsx';
import type { PrizeSettings, TournamentLevel, TournamentPlayer } from '../types/tournament.types';
import {
  buildTournamentPayload,
  EMPTY_PRIZE_SETTINGS,
  EMPTY_TOURNAMENT_FORM_DATA,
  EMPTY_TOURNAMENT_PLAYERS,
  mapTournamentToFormState,
} from '../utils/tournamentFormMapper';

export function EditTournamentView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();

  const [step, setStep] = useState(1);
  const [levels, setLevels] = useState<TournamentLevel[]>([]);
  const [players, setPlayers] = useState<TournamentPlayer[]>(EMPTY_TOURNAMENT_PLAYERS);
  const [prizes, setPrizes] = useState<PrizeSettings>(EMPTY_PRIZE_SETTINGS);
  const [formData, setFormData] = useState<TournamentFormData>(EMPTY_TOURNAMENT_FORM_DATA);
  const [isLoadingTournament, setIsLoadingTournament] = useState(true);

  useEffect(() => {
    async function loadTournament() {
      if (!tournamentId) {
        navigate('/tournaments');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/v1/tournaments/${tournamentId}`);

        if (response.ok) {
          const data = await response.json();
          const mappedState = mapTournamentToFormState(data);

          setFormData(mappedState.formData);
          setLevels(mappedState.levels);
          setPlayers(mappedState.players);
          setPrizes(mappedState.prizes);
        } else {
          console.error('Error loading tournament for editing.');
          navigate('/tournaments');
        }
      } catch (error) {
        console.error('Error connecting with API.', error);
        navigate('/tournaments');
      } finally {
        setIsLoadingTournament(false);
      }
    }

    loadTournament();
  }, [navigate, tournamentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!tournamentId) {
      return;
    }

    const payload = buildTournamentPayload(formData, levels, players, prizes);

    try {
      const response = await fetch(`http://localhost:8080/v1/tournaments/${tournamentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate('/tournaments');
      } else {
        console.error('Error updating tournament', await response.json());
      }
    } catch (error) {
      console.error('Error connecting with API.', error);
    }
  };

  const stepsConfig = [
    {
      title: t('tournament.new.generalSettings.stepTitle'),
      content: <TournamentGeneralSettingsStep formData={formData} onChange={handleInputChange} />,
      primaryAction: () => setStep(2),
      primaryLabel: t('tournament.new.next'),
      primaryIcon: <ArrowRight size={16} />,
      primaryClass: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: t('tournament.new.blindStructure.stepTitle'),
      content: (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <TournamentLevelStructureManagerStep levels={levels} onLevelsChange={setLevels} />
        </div>
      ),
      primaryAction: () => setStep(3),
      primaryLabel: t('tournament.new.next'),
      primaryIcon: <ArrowRight size={16} />,
      primaryClass: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: t('tournament.new.players.stepTitle'),
      content: <TournamentPlayersStep players={players} onPlayersChange={setPlayers} />,
      primaryAction: () => setStep(4),
      primaryLabel: t('tournament.new.next'),
      primaryIcon: <ArrowRight size={16} />,
      primaryClass: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: t('tournament.new.prizes.stepTitle'),
      content: (
        <TournamentPrizesStep
          prizes={prizes}
          onPrizesChange={setPrizes}
          prizePool={players.length * (Number(formData.buyIn) || 0)}
        />
      ),
      primaryAction: handleSave,
      primaryLabel: t('tournament.edit.save'),
      primaryIcon: <Save size={16} />,
      primaryClass: 'bg-green-600 hover:bg-green-700',
    },
  ];

  const currentStep = stepsConfig[step - 1];

  if (isLoadingTournament) {
    return <div className="p-8 text-white">{t('tournament.edit.loading')}</div>;
  }

  return (
    <div className="p-8 h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => (step === 1 ? navigate('/tournaments') : setStep(step - 1))}
          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('tournament.edit.title')}</h1>
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