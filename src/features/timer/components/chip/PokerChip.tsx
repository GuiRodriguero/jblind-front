interface PokerChipProps {
  readonly amount: number;
}

export default function PokerChip({ amount }: PokerChipProps) {
  const getChipConfig = (val: number) => {
    if (val <= 1) return { bg: '#64748b', stripe: '#ffffff', text: '#ffffff' };
    if (val <= 5) return { bg: '#dc2626', stripe: '#ffffff', text: '#ffffff' };
    if (val <= 10) return { bg: '#2563eb', stripe: '#ffffff', text: '#ffffff' };
    if (val <= 25) return { bg: '#16a34a', stripe: '#ffffff', text: '#ffffff' };
    if (val <= 100) return { bg: '#1a1a1a', stripe: '#ffffff', text: '#ffffff' };
    if (val <= 500) return { bg: '#9333ea', stripe: '#ffffff', text: '#ffffff' };
    if (val <= 1000) return { bg: '#eab308', stripe: '#ffffff', text: '#fde047' };
    if (val <= 5000) return { bg: '#f97316', stripe: '#ffffff', text: '#fb923c' };
    if (val <= 10000) return { bg: '#06b6d4', stripe: '#ffffff', text: '#22d3ee' };
    return { bg: '#db2777', stripe: '#ffffff', text: '#f472b6' };
  };

  const formatAmount = (val: number) => {
    return val >= 1000 ? `${val / 1000}k` : val;
  };

  const chipConfig = getChipConfig(amount);

  return (
    <div
      className="relative flex items-center justify-center rounded-full shadow-[0_3px_5px_rgba(0,0,0,0.5)] border border-black/50 sm:w-10 sm:h-10 w-8 h-8"
      style={{
        backgroundColor: chipConfig.bg,
        backgroundImage: `repeating-conic-gradient(
          ${chipConfig.stripe} 0deg 25deg, 
          transparent 20.5deg 59.5deg, 
          ${chipConfig.stripe} 60deg
        )`,
      }}
    >
      <div
        className="absolute flex items-center justify-center rounded-full shadow-inner w-3/4 h-3/4"
        style={{ backgroundColor: `${chipConfig.bg}`, border: `1px solid ${chipConfig.stripe}` }}
      >
        <span className="text-[10px] sm:text-xs font-black tracking-tighter" style={{ color: chipConfig.text }}>
          {formatAmount(amount)}
        </span>
      </div>
    </div>
  );
}
