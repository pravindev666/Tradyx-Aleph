import AdSlot from '@/components/AdSlot';

export default function AdSidebar({ slot = 'XXXXXXXXXX' }: { slot?: string }) {
  return (
    <div className="w-full">
      <div className="p-3 border-2 border-dashed border-blue-300 dark:border-blue-500/30 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-center max-w-[300px] mx-auto rounded-lg">
        <AdSlot
          slot={slot}
          style={{ display: 'block', width: 300, height: 250, margin: '0 auto' }}
          format=""
          fullWidthResponsive="false"
        />
      </div>
    </div>
  );
}
