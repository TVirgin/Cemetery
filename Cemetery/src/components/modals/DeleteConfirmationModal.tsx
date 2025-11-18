// src/components/modals/DeleteConfirmationModal.tsx
import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { Person } from '@/pages/records/records.types';

// The props interface now matches the return values of the useDeleteConfirmation hook
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  closeDeleteModal: () => void;
  confirmDelete: () => void;
  recordToDelete: Person | null;
  reauthEmail: string;
  setReauthEmail: (value: string) => void;
  reauthPassword: string;
  setReauthPassword: (value: string) => void;
  modalError: string | null;
  isDeleting: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  closeDeleteModal,
  confirmDelete,
  recordToDelete,
  reauthEmail,
  setReauthEmail,
  reauthPassword,
  setReauthPassword,
  modalError,
  isDeleting,
}) => {
  // The component's render condition now uses the updated prop names
  if (!isOpen || !recordToDelete) return null;

  return (
    // The underlying JSX structure is identical to your original version
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Confirm Deletion
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">
                    Are you sure you want to delete this record?
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                        {recordToDelete.firstName} {recordToDelete.lastName}
                    </p>
                    <p className="text-xs text-red-500 mt-2">
                        This action is irreversible. Please re-authenticate by providing your email and password.
                    </p>
                </div>
            </div>
        </div>

        {modalError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-md">
            <p className="text-sm text-red-700">{modalError}</p>
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="modalReauthEmail" className="block text-sm font-medium text-gray-700">
              Email (Username)
            </label>
            <input
              type="email"
              name="modalReauthEmail"
              id="modalReauthEmail"
              value={reauthEmail}
              onChange={(e) => setReauthEmail(e.target.value)}
              disabled={isDeleting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="modalReauthPassword" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="modalReauthPassword"
              id="modalReauthPassword"
              value={reauthPassword}
              onChange={(e) => setReauthPassword(e.target.value)}
              disabled={isDeleting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse gap-3">
          <button
            type="button"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Record'}
          </button>
          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={isDeleting}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-70"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
