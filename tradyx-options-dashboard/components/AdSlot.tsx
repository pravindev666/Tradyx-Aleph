'use client';

import { useEffect, useState } from 'react';

type Props = {
  slot: string;
  style?: React.CSSProperties;
  format?: string;
  fullWidthResponsive?: string;
  className?: string;
};

export default function AdSlot({
  slot,
  style = { display: 'block' },
  format = 'auto',
  fullWidthResponsive = 'true',
  className = ''
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only render on client to avoid hydration mismatch
    setMounted(true);
  }, []);

  // Don't render on server to prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        className={className}
        style={style}
        suppressHydrationWarning
      >
        {/* Placeholder for ad slot */}
      </div>
    );
  }

  // Render placeholder div for ad slot
  return (
    <div
      className={className}
      style={style}
      data-ad-slot={slot}
      suppressHydrationWarning
    >
      {/* Ad slot placeholder - slot: {slot} */}
    </div>
  );
}

