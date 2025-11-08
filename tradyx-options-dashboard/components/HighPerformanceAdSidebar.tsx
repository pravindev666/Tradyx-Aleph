'use client';

import HighPerformanceAd from '@/components/HighPerformanceAd';

type HighPerformanceAdSidebarProps = {
  adKey: string;
  width: number;
  height: number;
};

export default function HighPerformanceAdSidebar({ adKey, width, height }: HighPerformanceAdSidebarProps) {
  const minWidth = Math.min(width, 300);
  return (
    <div className="w-full">
      <div className="p-2 sm:p-3 border-2 border-dashed border-blue-300/40 dark:border-blue-500/20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-center mx-auto rounded-lg" style={{ maxWidth: `${width + 24}px`, width: '100%' }}>
        <div className="w-full flex justify-center items-center overflow-x-auto" style={{ minHeight: `${height}px` }}>
          <div style={{ minWidth: `${minWidth}px` }} className="sm:min-w-full flex justify-center">
            <HighPerformanceAd 
              adKey={adKey}
              width={width}
              height={height}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

