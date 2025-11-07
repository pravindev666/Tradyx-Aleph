'use client';

import { useEffect, useRef, useState } from 'react';

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
  const insRef = useRef<HTMLElement>(null);
  const pushedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only render on client to avoid hydration mismatch
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || pushedRef.current) return;
    
    try {
      // @ts-ignore
      if (window.adsbygoogle && insRef.current) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [mounted]);

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

  return (
    <ins
      ref={insRef as any}
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-3773170640876257"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive}
      suppressHydrationWarning
    />
  );
}

