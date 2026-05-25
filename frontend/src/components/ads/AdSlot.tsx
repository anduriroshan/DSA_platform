interface AdSlotProps {
  size: 'leaderboard' | 'rectangle' | 'skyscraper';
  label?: string;
  variant?: 'light' | 'dark' | 'seamless';
  className?: string;
}

const SIZE_LABEL: Record<AdSlotProps['size'], string> = {
  leaderboard: '728 × 90',
  rectangle:   '300 × 250',
  skyscraper:  '160 × 600',
};

export default function AdSlot({ size, label, variant = 'light', className = '' }: AdSlotProps) {
  const isSeamless = variant === 'seamless';
  return (
    <div
      className={`ad-slot ad-slot-${size} ${variant === 'dark' ? 'dark' : ''} ${isSeamless ? 'seamless' : ''} ${className}`}
      data-ad-slot={size}
    >
      {!isSeamless && (
        <span>
          ◈ AD SLOT<br />
          {label ?? SIZE_LABEL[size]}
        </span>
      )}
    </div>
  );
}
