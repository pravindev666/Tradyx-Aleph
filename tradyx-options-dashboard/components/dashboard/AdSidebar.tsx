import AdSlot from '@/components/AdSlot';

type AdSidebarProps = {
  slot: string;
  width?: number;
  height?: number;
};

export default function AdSidebar({ slot, width = 300, height = 250 }: AdSidebarProps) {
  return (
    <div className="w-full">
      <div className="p-3 border-2 border-dashed border-blue-300 dark:border-blue-500/30 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-center mx-auto rounded-lg" style={{ maxWidth: `${width + 24}px` }}>
        <AdSlot
          slot={slot}
          style={{ display: 'block', width, height, margin: '0 auto' }}
          format="auto"
          fullWidthResponsive="true"
        />
      </div>
    </div>
  );
}
