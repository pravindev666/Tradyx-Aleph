import AdsterraBanner from '@/components/ads/AdsterraBanner';

type AdSidebarProps = {
  adKey: string;
  width?: number;
  height?: number;
  label?: string;
  loadDelay?: number;
};

export default function AdSidebar({ 
  adKey, 
  width = 300, 
  height = 250,
  label = 'Advertisement',
  loadDelay
}: AdSidebarProps) {
  return (
    <AdsterraBanner
      adKey={adKey}
      width={width}
      height={height}
      label={label}
      loadDelay={loadDelay}
      className="mx-auto"
    />
  );
}
