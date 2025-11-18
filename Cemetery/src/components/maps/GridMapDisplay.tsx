// src/components/maps/GridMapDisplay.tsx
import * as React from 'react';
import { BlockLayout } from '@/pages/records/records.types';
import { cn } from '@/lib/utils';

interface GridMapDisplayProps {
  layout: BlockLayout;
  selectedLotNum?: number | null;
  onLotClick: (lotNum: number) => void;
}

export const GridMapDisplay: React.FC<GridMapDisplayProps> = ({
  layout,
  selectedLotNum,
  onLotClick,
}) => {
  const lots = Array.from({ length: layout.lotCount }, (_, i) => i + 1);

  // Helper function to render a single lot button
  const renderLot = (lotNum: number) => (
    <button
      key={lotNum}
      onClick={() => onLotClick(lotNum)}
      className={cn(
        "w-full h-20 border rounded-md text-lg font-bold flex items-center justify-center transition-all duration-150 shadow-sm",
        "bg-sky-100 border-sky-300 text-sky-800 hover:bg-sky-200",
        selectedLotNum === lotNum && "ring-4 ring-offset-1 ring-orange-400"
      )}
    >
      {lotNum}
    </button>
  );

  const lotColumns = layout.lotColumns || 1;

  // Render one or two columns based on layout config
  if (lotColumns === 2) {
    const midpoint = Math.ceil(lots.length / 2);
    const column1Lots = lots.slice(0, midpoint);
    const column2Lots = lots.slice(midpoint);
    return (
      <div className="p-2 grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {column1Lots.map(lotNum => renderLot(lotNum))}
        </div>
        <div className="space-y-3">
          {column2Lots.map(lotNum => renderLot(lotNum))}
        </div>
      </div>
    );
  }

  // Default to a single column layout
  return (
    <div className="p-2 grid grid-cols-1 gap-3 max-w-xs mx-auto">
      <div className="space-y-3">
        {lots.map(lotNum => renderLot(lotNum))}
      </div>
    </div>
  );
};
