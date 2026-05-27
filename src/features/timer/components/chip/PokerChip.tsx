import './poker-chip.css';

type ChipColor = 'gray' | 'red' | 'blue' | 'green' | 'black' | 'purple' | 'yellow' | 'orange' | 'light-blue' | 'pink';

interface PokerChipProps {
  readonly amount?: number;
  readonly color?: ChipColor;
  readonly size?: 'sm' | 'md' | 'lg';
}

const NUMBERED_CHIP_COLORS: Array<{
  max: number;
  color: ChipColor;
}> = [
  { max: 1, color: 'gray' },
  { max: 5, color: 'red' },
  { max: 10, color: 'blue' },
  { max: 25, color: 'green' },
  { max: 100, color: 'black' },
  { max: 500, color: 'purple' },
  { max: 1000, color: 'yellow' },
  { max: 5000, color: 'orange' },
  { max: 10000, color: 'light-blue' },
];

export default function PokerChip({ amount, color = 'gray', size = 'md' }: PokerChipProps) {
  const chipColor = amount != null ? (NUMBERED_CHIP_COLORS.find((chip) => amount <= chip.max)?.color ?? 'pink') : color;

  const formatAmount = (val: number) => {
    return val >= 1000 ? `${val / 1000}k` : val;
  };

  return (
    <div className={`poker-chip poker-chip--${size} poker-chip--${chipColor}`}>
      <div className="poker-chip-inner">
        <span className="poker-chip-text">{amount != null && formatAmount(amount)}</span>
      </div>
    </div>
  );
}
