// src/components/modals/RecordEditModal.tsx
import * as React from 'react';
import { Person } from '@/pages/records/records.types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';

interface RecordEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRecord: Person) => Promise<void>;
  record: Person | null;
}

export const RecordEditModal: React.FC<RecordEditModalProps> = ({ isOpen, onClose, onSave, record }) => {
  const [formData, setFormData] = React.useState<Person | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // When the modal is opened with a record, populate the form
    if (record) {
      setFormData(record);
      setError(null); // Clear any previous errors
    } else {
      setFormData(null);
    }
  }, [record]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { id, value } = e.target;
    const numValue = value === '' ? '' : parseInt(value, 10);
    if (value === '' || !isNaN(numValue as number)) {
        setFormData({ ...formData, [id]: { ...formData, [id]: numValue } });
    }
  };

  const handleSaveClick = async () => {
    if (!formData) return;
    setIsSaving(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      console.error("Failed to save record:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60" aria-labelledby="edit-modal-title" role="dialog" aria-modal="true">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl transform transition-all relative">
        <div className="flex justify-between items-center pb-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900" id="edit-modal-title">
                Edit Record
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={isSaving}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </Button>
        </div>

        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange} disabled={isSaving} />
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange} disabled={isSaving} />
                </div>
                <div>
                    <Label htmlFor="birth">Birth Date</Label>
                    <Input id="birth" value={formData.birth || ''} onChange={handleInputChange} placeholder="YYYY-MM-DD" disabled={isSaving} />
                </div>
                <div>
                    <Label htmlFor="death">Death Date</Label>
                    <Input id="death" value={formData.death || ''} onChange={handleInputChange} placeholder="YYYY-MM-DD" disabled={isSaving} />
                </div>
            </div>

            <div className="pt-4 border-t">
                <h4 className="text-md font-medium text-gray-800 mb-2">Location</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <Label htmlFor="block">Block</Label>
                        <Input id="block" value={formData.block || ''} onChange={handleInputChange} disabled={isSaving} />
                    </div>
                    <div>
                        <Label htmlFor="lot">Lot</Label>
                        <Input id="lot" type="number" value={formData.lot ?? ''} onChange={handleNumericInputChange} disabled={isSaving} />
                    </div>
                    <div>
                        <Label htmlFor="pos">Position</Label>
                        <Input id="pos" type="number" value={formData.sect ?? ''} onChange={handleNumericInputChange} disabled={isSaving} />
                    </div>
                    <div>
                        <Label htmlFor="plot">Plot</Label>
                        <Input id="plot" type="number" value={formData.plot ?? ''} onChange={handleNumericInputChange} disabled={isSaving} />
                    </div>
                </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
        </div>

        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
            </Button>
            <Button onClick={handleSaveClick} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      </div>
    </div>
  );
};
