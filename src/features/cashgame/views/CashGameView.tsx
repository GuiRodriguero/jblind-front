import { CircleDollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CashGameTable } from '../components/CashGameTable';
import { useTranslation } from 'react-i18next';

export function CashGameView() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-8 h-full flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{t('cashgame.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('cashgame.description')}</p>
        </div>

        <button
          onClick={() => navigate('/cashgames/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all"
        >
          <CircleDollarSign size={18} />
          {t('cashgame.newCashGame')}
        </button>
      </div>

      <div className="flex-1">
        <CashGameTable />
      </div>
    </div>
  );
}
