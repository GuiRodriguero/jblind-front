import { useTranslation } from 'react-i18next';
import { type CashGameLog, CashGameLogType } from '../types/cashgame.types';

interface CashGameActivityLogsProps {
  logs: CashGameLog[];
}

const LOG_TYPE_COLORS = {
  [CashGameLogType.BUY_IN]: 'text-green-400',
  [CashGameLogType.REBUY]: 'text-blue-400',
  [CashGameLogType.ADD_ON]: 'text-purple-400',
  [CashGameLogType.CASHOUT]: 'text-amber-400',
};

export function CashGameActivityLogs({ logs }: CashGameActivityLogsProps) {
  const { t } = useTranslation();

  return (
    <div className="col-span-12 xl:col-span-4 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col xl:h-full min-h-0">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 shrink-0">
        {t('cashgame.active.logs.title')}
      </h2>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {logs.length === 0 ? (
          <p className="text-center text-sm text-gray-600 mt-10">{t('cashgame.active.logs.empty')}</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 text-sm">
              <span className="text-gray-500 font-mono shrink-0">[{log.timestamp}]</span>
              <span className={LOG_TYPE_COLORS[log.type as keyof typeof LOG_TYPE_COLORS] || 'text-white'}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
