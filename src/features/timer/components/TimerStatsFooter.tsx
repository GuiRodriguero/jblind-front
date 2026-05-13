function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center bg-white/5 py-3 rounded-xl border border-white/5">
      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-200">{value}</p>
    </div>
  );
}

export function TimerStatsFooter() {
  return (
    <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10 mt-auto shrink-0">
      <StatItem label="Entrants" value="1,000" />
      <StatItem label="Remaining" value="700" />
      <StatItem label="Chips in Play" value="200,000" />
      <StatItem label="Avg. Stack" value="286" />
    </div>
  );
}
