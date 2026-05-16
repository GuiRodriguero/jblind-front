import { useTranslation } from 'react-i18next';

interface TimerStatsFooterProps {
  readonly entrants: number;
  readonly remaining: number;
  readonly chipsInPlay: number;
  readonly avgStack: number;
}

export function TimerStatsFooter({ entrants, remaining, chipsInPlay, avgStack }: TimerStatsFooterProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10 mt-auto shrink-0">
      <StatItem label={t('timer.entrants')} value={entrants} />
      <StatItem label={t('timer.remaining')} value={remaining} />
      <StatItem label={t('timer.chipsInPlay')} value={chipsInPlay.toLocaleString()} />
      <StatItem label={t('timer.averageStack')} value={avgStack.toLocaleString()} />
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center bg-white/5 py-3 rounded-xl border border-white/5">
      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-200">{value}</p>
    </div>
  );
}
