import { User } from 'lucide-react';

export function TimerPlayersCard() {
  return (
    <div className="col-span-3 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col min-h-0 overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Players</h2>
        <span className="text-xs font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded">18 Left</span>
      </div>

      <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-lg border border-transparent hover:border-white/10 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <User size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-200">Player {i + 1}</p>
                <p className="text-[10px] text-gray-500 uppercase">Seat {i + 1}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-white">{(25000 - i * 1000).toLocaleString()}</p>
              <p className="text-[10px] text-green-400">Chips</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
