// src/components/maps/LotDisplay.tsx
import * as React from 'react';
import { Person, BlockLayout, PlotIdentifier } from '@/pages/records/records.types';
import { cn } from '@/lib/utils';

interface LotDisplayProps {
  layout: BlockLayout;
  lotNum: number;
  occupiedRecords: Person[];
  selectedPlot?: PlotIdentifier | null;
  onPlotClick: (plotIdentifier: PlotIdentifier) => void;
}

export const LotDisplay: React.FC<LotDisplayProps> = ({
  layout,
  lotNum,
  occupiedRecords,
  selectedPlot,
  onPlotClick,
}) => {
  const positionsPerLot = layout.sectionCount;

  // Filter records for only the current lot
  const recordsInLot = React.useMemo(() => {
    return occupiedRecords.filter(r => r.lot === lotNum);
  }, [occupiedRecords, lotNum]);

  // Create a map of records within this lot for quick lookup
  const occupiedPositionMap = React.useMemo(() => {
    const map = new Map<string, Person[]>();
    recordsInLot.forEach(record => {
      if (record.sect !== undefined) {
        const key = `${record.sect}`; // Key is just the position number now
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)!.push(record);
      }
    });
    return map;
  }, [recordsInLot]);

  // Helper function to render a single position
  const renderPosition = (posNum: number) => {
    const recordsInPosition = occupiedPositionMap.get(String(posNum)) || [];
    const plotMap = new Map(recordsInPosition.map(r => [r.plot, r]));

    return (
      <div key={posNum} className="border rounded-lg p-2 bg-white shadow-sm">
        <p className="text-center text-xs font-semibold text-gray-600 mb-2">
          Position {posNum}
        </p>
        <div className="grid grid-cols-2 gap-1">
          {Array.from({ length: layout.plotCount }, (_, i) => i + 1).map(plotNum => {
            const record = plotMap.get(plotNum);
            const plotIdentifier: PlotIdentifier = {
              block: layout.id, lot: lotNum, sect: posNum, plot: plotNum,
              rawId: record?.id || `empty-${layout.id}-${lotNum}-${posNum}-${plotNum}`
            };
            const isSelected = selectedPlot?.block === layout.id && selectedPlot?.lot === lotNum && selectedPlot?.sect === posNum && selectedPlot?.plot === plotNum;
            const title = record ? `${record.firstName} ${record.lastName}\nLocation: ${plotIdentifier.rawId}` : `Empty\nLocation: ${plotIdentifier.rawId}`;

            return (
              <button
                key={plotNum}
                onClick={() => onPlotClick(plotIdentifier)}
                title={title}
                className={cn(
                  "w-full h-8 border rounded text-[10px] flex items-center justify-center transition-all duration-150",
                  record ? "bg-green-200 border-green-400 text-green-900 hover:bg-green-300" : "bg-gray-200 border-gray-300 hover:bg-gray-300",
                  isSelected && "ring-4 ring-orange-400"
                )}
              >
                {plotNum}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Split positions into two columns for rendering
  const positions = Array.from({ length: positionsPerLot }, (_, i) => i + 1);
  const posMidpoint = Math.ceil(positions.length / 2);
  const posColumn1 = positions.slice(0, posMidpoint);
  const posColumn2 = positions.slice(posMidpoint);

  return (
    <div className="p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
                {posColumn1.map(posNum => renderPosition(posNum))}
            </div>
            <div className="space-y-4">
                {posColumn2.map(posNum => renderPosition(posNum))}
            </div>
        </div>
    </div>
  );
};
