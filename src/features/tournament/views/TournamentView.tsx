import { Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TournamentTable } from '../components/TournamentTable';
import { useTranslation } from 'react-i18next';

export function TournamentView() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-8 h-full flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{t('tournament.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('tournament.description')}</p>
        </div>

        <button
          onClick={() => navigate('/tournaments/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all"
        >
          <Trophy size={18} />
          {t('tournament.newTournament')}
        </button>
      </div>

      <div className="flex-1">
        <TournamentTable />
      </div>
    </div>
  );
}
