import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { CashGameGeneralSettingsStep, type CashGameFormData } from '../components/CashGameGeneralSettingsStep.tsx';
import { CashGamePlayersStep } from '../components/CashGamePlayersStep.tsx';
import type { CashGamePlayer } from '../types/cashgame.types';
import {
  buildCashGamePayload,
  EMPTY_CASH_GAME_FORM_DATA,
  EMPTY_CASH_GAME_PLAYERS,
  mapCashGameToFormState,
} from '../utils/cashGameFormMapper';

export function EditCashGameView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cashGameId } = useParams<{ cashGameId: string }>();

  const [step, setStep] = useState(1);
  const [players, setPlayers] = useState<CashGamePlayer[]>(EMPTY_CASH_GAME_PLAYERS);
  const [formData, setFormData] = useState<CashGameFormData>(EMPTY_CASH_GAME_FORM_DATA);
  const [isLoadingCashGame, setIsLoadingCashGame] = useState(true);

  useEffect(() => {
    async function loadCashGame() {
      if (!cashGameId) {
        navigate('/cashgames');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/v1/cashgames/${cashGameId}`);

        if (response.ok) {
          const data = await response.json();
          const mappedState = mapCashGameToFormState(data);

          setFormData(mappedState.formData);
          setPlayers(mappedState.players);
        } else {
          console.error('Error loading cash game for editing.');
          navigate('/cashgames');
        }
      } catch (error) {
        console.error('Error connecting with API.', error);
        navigate('/cashgames');
      } finally {
        setIsLoadingCashGame(false);
      }
    }

    loadCashGame();
  }, [navigate, cashGameId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!cashGameId) {
      return;
    }

    const payload = buildCashGamePayload(formData, players);

    try {
      const response = await fetch(`http://localhost:8080/v1/cashgames/${cashGameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate('/cashgames');
      } else {
        console.error('Error updating cash game', await response.json());
      }
    } catch (error) {
      console.error('Error connecting with API.', error);
    }
  };

  const stepsConfig = [
    {
      title: t('cashgame.new.generalSettings.stepTitle'),
      content: <CashGameGeneralSettingsStep formData={formData} onChange={handleInputChange} />,
      primaryAction: () => setStep(2),
      primaryLabel: t('cashgame.new.next'),
      primaryIcon: <ArrowRight size={16} />,
      primaryClass: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: t('cashgame.new.players.stepTitle'),
      content: <CashGamePlayersStep players={players} onPlayersChange={setPlayers} />,
      primaryAction: handleSave,
      primaryLabel: t('cashgame.edit.save'),
      primaryIcon: <Save size={16} />,
      primaryClass: 'bg-green-600 hover:bg-green-700',
    },
  ];

  const currentStep = stepsConfig[step - 1];

  if (isLoadingCashGame) {
    return <div className="p-8 text-white">{t('cashgame.edit.loading')}</div>;
  }

  return (
    <div className="p-8 h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => (step === 1 ? navigate('/cashgames') : setStep(step - 1))}
          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('cashgame.edit.title')}</h1>
          <p className="text-sm text-gray-400">{currentStep.title}</p>
        </div>
      </div>

      <div className="flex-1 bg-surface border border-white/10 rounded-2xl p-8 shadow-xl">{currentStep.content}</div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => navigate('/cashgames')}
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
