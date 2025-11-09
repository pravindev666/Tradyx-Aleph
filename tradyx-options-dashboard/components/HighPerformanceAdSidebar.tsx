'use client';

import AdsterraBanner from '@/components/ads/AdsterraBanner';

type HighPerformanceAdSidebarProps = {
  adKey: string;
  width: number;
  height: number;
  label?: string;
  loadDelay?: number;
};

export default function HighPerformanceAdSidebar({ 
  adKey, 
  width, 
  height,
  label = 'Sidebar Ad',
  loadDelay
}: HighPerformanceAdSidebarProps) {
  return (
    <div className="w-full">
      <div 
        className="ad-container-transparent p-2 sm:p-3 text-center mx-auto rounded-xl" 
        style={{ maxWidth: `${width + 24}px`, width: '100%' }}
      >
        <AdsterraBanner 
          adKey={adKey}
          width={width}
          height={height}
          label={label}
          loadDelay={loadDelay}
        />
      </div>
    </div>
  );
}

