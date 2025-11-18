// src/components/modals/RecordInfoModal.tsx
import * as React from 'react';
import { Person } from '@/pages/records/records.types'; // Adjust path
import { XCircle, Info, Pencil, Trash2 } from 'lucide-react';

interface RecordInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Person | null;
  onEdit?: () => void;
  onDelete?: () => void;
  canManage: boolean;
}

export const RecordInfoModal: React.FC<RecordInfoModalProps> = ({
  isOpen,
  onClose,
  record,
  onEdit,
  onDelete,
  canManage,
}) => {
  if (!isOpen || !record) {
    return null;
  }

  // CORRECTED Helper to format Date objects
  const formatDateDisplay = (dateValue: string | null | undefined): string => {
    if (!dateValue) { // Handles null or undefined
      return 'N/A';
    } else {
      return dateValue;
    }
    
   
    // try {
    //   // Format the Date object into a readable string
    //   return dateValue.toLocaleDateString(undefined, { // Uses browser's locale
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric'
    //   });
    // } catch (e) {
    //   console.error("Error formatting date:", e);
    //   return dateValue.toISOString(); // Fallback
    // }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
      aria-labelledby="info-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // Click on backdrop closes the modal
    >
      <div
        className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100 flex flex-col max-h-[90vh]" // Added flex, flex-col, max-h
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal content
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b flex-shrink-0">
          <div className='flex items-center min-w-0'>
            <Info className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true" />
            <h3 className="text-lg sm:text-xl leading-6 font-medium text-gray-900 truncate" id="info-modal-title">
              Record Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <XCircle size={24} className="sm:w-7 sm:h-7"/> {/* Slightly smaller on mobile */}
          </button>
        </div>

        {/* Modal Content - Make this part scrollable */}
        <div className="overflow-y-auto flex-grow pr-1"> {/* Added flex-grow and overflow-y-auto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 text-sm text-gray-700">
            <div><strong>First Name:</strong> <span className="text-gray-900">{record.firstName}</span></div>
            {record.middleName && <div><strong>Middle Name:</strong> <span className="text-gray-900">{record.middleName}</span></div>}
            <div><strong>Last Name:</strong> <span className="text-gray-900">{record.lastName}</span></div>
            <div><strong>Birth Info:</strong> <span className="text-gray-900">{formatDateDisplay(record.birth)}</span></div>
            <div><strong>Death Info:</strong> <span className="text-gray-900">{formatDateDisplay(record.death)}</span></div>
            <div><strong>Block:</strong> <span className="text-gray-900">{record.block}</span></div>
            <div><strong>Row:</strong> <span className="text-gray-900">{record.lot}</span></div>
            <div><strong>Position:</strong> <span className="text-gray-900">{record.sect}</span></div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end items-center border-t pt-4 sm:pt-6 gap-3 flex-shrink-0"> {/* Added flex-shrink-0 */}
          {canManage && onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-sky-700 bg-sky-100 border border-transparent rounded-md shadow-sm hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              <Pencil size={16} className="mr-2" /> Edit
            </button>
          )}
          {canManage && onDelete && (
             <button
              type="button"
              onClick={onDelete}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-md shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};