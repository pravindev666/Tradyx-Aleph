'use client';

import HighPerformanceAd from '@/components/HighPerformanceAd';

type HighPerformanceAdSidebarProps = {
  adKey: string;
  width: number;
  height: number;
};

export default function HighPerformanceAdSidebar({ adKey, width, height }: HighPerformanceAdSidebarProps) {
  return (
    <div className="w-full">
      <div 
        className="ad-container-transparent p-2 sm:p-3 text-center mx-auto rounded-xl" 
        style={{ maxWidth: `${width + 24}px`, width: '100%' }}
      >
        <div className="w-full flex justify-center items-center overflow-hidden" style={{ minHeight: `${height}px` }}>
          <HighPerformanceAd 
            adKey={adKey}
            width={width}
            height={height}
          />
        </div>
      </div>
    </div>
  );
}

