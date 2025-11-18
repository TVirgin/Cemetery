// src/components/records/CemeteryMapManager.tsx
import * as React from 'react';
import { Person, PlotIdentifier, BlockLayout } from '@/pages/records/records.types';
import { User } from 'firebase/auth';
import { getBlockLayout, setBlockLayout } from '@/services/blockLayoutService';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

import { InteractiveCemeteryMap } from '../../components/maps/InteractiveCemeteryMap';
import { CemeteryMapSVG } from '../../components/maps/CemeteryMapSVG'; // Your main overview map component
import { GridMapDisplay } from '../../components/maps/GridMapDisplay'; // Your new grid-based map
import { BlockLayoutFormModal } from '../../components/modals/BlockLayoutFormModal'; // Import new modal
import { LotDisplay } from '../../components/maps/LotDisplay'; // Import the new LotDisplay component

interface CemeteryMapManagerProps {
  user: User | null;
  activeBlockId: string | null;
  plotToHighlight: PlotIdentifier | null;
  recordsForBlock: Person[];
  activeLotId: number | null;
  onBlockChange: (blockId: string | null) => void;
  onPlotClick: (plotIdentifier: PlotIdentifier) => void;
  onLotChange: (lotNum: number | null) => void; // NEW: Prop to notify parent of lot selection
}

export const CemeteryMapManager: React.FC<CemeteryMapManagerProps> = ({
  user,
  activeBlockId,
  plotToHighlight,
  recordsForBlock,
  activeLotId,
  onBlockChange,
  onPlotClick,
  onLotChange // Destructure new prop
}) => {
  const [activeBlockLayout, setActiveBlockLayout] = React.useState<BlockLayout | null | 'not-found'>(null);
  const [isLayoutLoading, setIsLayoutLoading] = React.useState(false);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = React.useState(false);
  const [isLayoutSaving, setIsLayoutSaving] = React.useState(false);

  const [activeLotNum, setActiveLotNum] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (activeBlockId) {
      setIsLayoutLoading(true);
      if (activeLotId) {
        setActiveLotNum(activeLotId);
        onLotChange(activeLotId);
      } else {
        setActiveLotNum(null);
        onLotChange(null); // Clear lot selection in parent when block changes
      }

      getBlockLayout(activeBlockId)
        .then(layout => setActiveBlockLayout(layout || 'not-found'))
        .catch(error => {
          console.error("Failed to load block layout:", error);
          setActiveBlockLayout('not-found');
        })
        .finally(() => setIsLayoutLoading(false));
    } else {
      setActiveBlockLayout(null);
      setActiveLotNum(null);
      onLotChange(null); // Clear lot selection in parent when block changes
    }
  }, [activeBlockId, onLotChange]);

  const handleMapBlockClick = (plotIdentifier: PlotIdentifier) => {
    onBlockChange(plotIdentifier.block);
  };

  const handleReturnToOverview = () => {
    onBlockChange(null);
    // onLotChange is handled by the useEffect above
  };

  const handleReturnToBlockView = () => {
    setActiveLotNum(null);
    onLotChange(null); // Notify parent that we are no longer filtering by lot
  };

  // NEW: Handler that updates local state and notifies parent
  const handleLotClick = (lotNum: number) => {
    setActiveLotNum(lotNum);
    onLotChange(lotNum);
  };

  const handleLayoutFormSubmit = async (layoutData: { lotCount: number; plotCount: number; sectionCount: number; lotColumns?: number; hasSection: boolean}) => {
    if (!activeBlockId) return;
    setIsLayoutSaving(true);
    try {
      await setBlockLayout(activeBlockId, layoutData);
      setIsLayoutModalOpen(false);
      const newLayout = await getBlockLayout(activeBlockId);
      setActiveBlockLayout(newLayout || 'not-found');
    } catch (error: any) {
      alert(`Error saving layout: ${error.message}`);
    } finally {
      setIsLayoutSaving(false);
    }
  };

  const getTitle = () => {
    if (activeLotNum) return `Lot ${activeLotNum} Details`;
    if (activeBlockId) return `Block ${activeBlockId} Overview`;
    return "Cemetery Overview";
  }

  return (
    <div className="mb-6 p-1 sm:p-2 border rounded-md bg-gray-50 shadow">
      <div className="flex justify-between items-center px-2 pt-1 mb-2 min-h-[40px]">
        <h3 className="text-lg font-medium text-gray-800">
          {getTitle()}
        </h3>
        <div>
          {activeBlockId && user && (
            <Button variant="outline" size="sm" onClick={() => setIsLayoutModalOpen(true)} className="flex items-center text-sm mr-2">
              <Edit size={16} className="mr-1" /> Edit Layout
            </Button>
          )}
          {activeLotNum ? (
            <Button variant="ghost" size="sm" onClick={handleReturnToBlockView} className="flex items-center text-sm">
              <ArrowLeft size={16} className="mr-1" /> Back to Block View
            </Button>
          ) : activeBlockId && (
            <Button variant="ghost" size="sm" onClick={handleReturnToOverview} className="flex items-center text-sm">
              <ArrowLeft size={16} className="mr-1" /> Back to Main Map
            </Button>
          )}
        </div>
      </div>

      {!activeBlockId ? (
        <InteractiveCemeteryMap
          SvgMapOverlayComponent={CemeteryMapSVG as any}
          onPlotClick={handleMapBlockClick}
          selectedPlotId={null}
        />
      ) : isLayoutLoading ? (
        <div className="text-center py-20">Loading Block Layout...</div>
      ) : activeBlockLayout === 'not-found' ? (
        <div className="text-center py-20 text-gray-600">
          <p>Layout for Block '{activeBlockId}' is not defined.</p>
          {user && <Button onClick={() => setIsLayoutModalOpen(true)} className="mt-4">Create Layout</Button>}
        </div>
      ) : activeBlockLayout && !activeLotNum ? (
        <GridMapDisplay
          layout={activeBlockLayout}
          onLotClick={handleLotClick} // Use the new handler
        />
      ) : activeBlockLayout && activeLotNum ? (
        <LotDisplay
          layout={activeBlockLayout}
          lotNum={activeLotNum}
          occupiedRecords={recordsForBlock}
          selectedPlot={plotToHighlight}
          onPlotClick={onPlotClick}
        />
      ) : null}

      <BlockLayoutFormModal
        isOpen={isLayoutModalOpen}
        onClose={() => setIsLayoutModalOpen(false)}
        onSubmit={handleLayoutFormSubmit}
        isSaving={isLayoutSaving}
        blockId={activeBlockId}
        initialData={activeBlockLayout !== 'not-found' ? activeBlockLayout : null}
      />
    </div>
  );
};
