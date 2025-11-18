import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XCircle, Save } from 'lucide-react';
import { BlockLayout } from '@/pages/records/records.types'; // Adjust path

interface BlockLayoutFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (layoutData: { lotCount: number; plotCount: number; sectionCount: number; lotColumns: number; hasSection: boolean; }) => void;
  isSaving: boolean;
  blockId: string | null; // The ID of the block being edited/created (e.g., "A", "1E")
  initialData?: Omit<BlockLayout, 'id' | 'blockName'> | null; // For pre-filling the form on edit
}

export const BlockLayoutFormModal: React.FC<BlockLayoutFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  blockId,
  initialData
}) => {
  const [lotCount, setLotCount] = React.useState(0);
  const [plotCount, setPlotCount] = React.useState(0);
  const [hasSection, setHasSection] = React.useState(false);
  const [sectionCount, setSectionCount] = React.useState(0);
  const [lotColumns, setLotColumns] = React.useState(0);


  React.useEffect(() => {
    // Populate form when initialData is provided (for editing)
    if (initialData) {
      setLotCount(initialData.lotCount || 0);
      setPlotCount(initialData.plotCount || 0);
      setHasSection(initialData.hasSection || false);
      setSectionCount(initialData.sectionCount || 0);
      setLotColumns(initialData.lotColumns || 0);
    } else {
      // Reset for creating a new layout
      setLotCount(0);
      setPlotCount(0);
      setHasSection(false);
      setSectionCount(0);
      setLotColumns(0);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lots = Number(lotCount);
    const plots = Number(plotCount);
    const hasSect = Boolean(hasSection);
    const sect = Number(sectionCount);
    const lotCol = Number(lotColumns);

    if (lots > 0 && plots > 0 && lotCol > 0) {
      onSubmit({ lotCount: lots, plotCount: plots, sectionCount: sect, lotColumns: lotCol, hasSection: hasSect });
    } else {
      alert("Please enter valid numbers greater than zero for lots and positions.");
    }
  };

  if (!isOpen || !blockId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} disabled={isSaving} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600" aria-label="Close modal">
          <XCircle size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {initialData ? `Edit Layout for Ward ${blockId}` : `Create Layout for Ward ${blockId}`}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="lotCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Lots</Label>
            <Input
              id="lotCount"
              type="number"
              min="1"
              value={lotCount}
              onChange={(e) => setLotCount(Number(e.target.value))}
              disabled={isSaving}
              required
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Number of Plots</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Input
                  id="plotCount4"
                  type="radio"
                  name="plotCount" // Important for grouping radio buttons
                  value="4"
                  checked={plotCount === 4}
                  onChange={(e) => setPlotCount(Number(e.target.value))}
                  disabled={isSaving}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <Label htmlFor="plotCount4" className="text-sm font-medium text-gray-700">4 Plots</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="plotCount8"
                  type="radio"
                  name="plotCount" // Important for grouping radio buttons
                  value="8"
                  checked={plotCount === 8}
                  onChange={(e) => setPlotCount(Number(e.target.value))}
                  disabled={isSaving}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <Label htmlFor="plotCount8" className="text-sm font-medium text-gray-700">8 Plots</Label>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2"> {/* Use flex for checkbox and label alignment */}
            <Input
              id="hasSection"
              type="checkbox" // Changed to checkbox
              checked={hasSection} // Use checked prop for checkboxes
              onChange={(e) => setHasSection(e.target.checked)} // Update with checked property
              disabled={isSaving}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" // Tailwind classes for checkbox
            />
            <Label htmlFor="hasSection" className="text-sm font-medium text-gray-700">Has Sections?</Label>
          </div>
          <div>
            <Label htmlFor="sectionCount" className={`block text-sm font-medium mb-1 ${!hasSection ? 'text-gray-400' : 'text-gray-700'}`}>Number of Sections</Label>
            <Input
              id="sectionCount"
              type="number"
              min="1"
              value={sectionCount}
              onChange={(e) => setSectionCount(Number(e.target.value))}
              disabled={isSaving || !hasSection} // Disabled if saving or hasSection is false
              required={hasSection} // Required only if hasSection is true
              className={`${!hasSection ? 'opacity-50 cursor-not-allowed' : ''}`} // Grey out if disabled
            />
          </div>
          <div>
            <Label htmlFor="lotColumns" className="block text-sm font-medium text-gray-700 mb-1">Lot Column Nums</Label>
            <Input
              id="lotColumns"
              type="number"
              min="1"
              value={lotColumns}
              onChange={(e) => setLotColumns(Number(e.target.value))}
              disabled={isSaving}
              required
            />
          </div>
          <div className="pt-2 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="flex items-center">
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Layout'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};