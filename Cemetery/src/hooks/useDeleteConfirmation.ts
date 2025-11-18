// src/hooks/useDeleteConfirmation.ts
import * as React from 'react';
import { useUserAuth } from '@/context/userAuthContext'; // Adjust path
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Person } from '@/pages/records/records.types'; // Adjust path as needed

// --- Import the deleteRecord function from your service ---
import { deleteRecord } from '@/services/recordService'; // Adjust path as needed

interface UseDeleteConfirmationOptions {
  onDeleteSuccess?: (deletedRecordId: string) => void; // Callback with ID of deleted record
}

export function useDeleteConfirmation({ onDeleteSuccess }: UseDeleteConfirmationOptions) {
  const { user } = useUserAuth();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState<Person | null>(null);
  const [reauthEmail, setReauthEmail] = React.useState('');
  const [reauthPassword, setReauthPassword] = React.useState('');
  const [modalError, setModalError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false); // This now covers re-auth + actual delete

  const openDeleteModal = (record: Person) => {
    setRecordToDelete(record);
    setReauthEmail(user?.email || '');
    setReauthPassword('');
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setRecordToDelete(null);
    setModalError(null);
    setIsDeleting(false); // Reset deleting state
  };

  const confirmDelete = async () => {
    if (!recordToDelete || !user) {
      setModalError("Cannot proceed: User or record information is missing.");
      return;
    }
    // The Person type now has id: string (non-optional), so recordToDelete.id is safe.
    if (!recordToDelete.id) {
        setModalError("Cannot proceed: Record ID is missing.");
        return;
    }
    if (!reauthEmail.trim() || !reauthPassword.trim()) {
      setModalError("Email and password are required for re-authentication.");
      return;
    }

    setIsDeleting(true);
    setModalError(null);

    try {
      // Step 1: Re-authenticate the user
      const credential = EmailAuthProvider.credential(reauthEmail, reauthPassword);
      await reauthenticateWithCredential(user, credential);
      console.log("User re-authenticated successfully.");

      // Step 2: Perform the actual deletion using the service function
      console.log("Attempting to delete record with ID:", recordToDelete.id);
      await deleteRecord(recordToDelete.id); // Call your service function
      console.log("Record successfully deleted from database.");

      // Step 3: Call success callback and close modal
      if (onDeleteSuccess) {
        onDeleteSuccess(recordToDelete.id);
      }
      closeDeleteModal();

    } catch (error: any) {
      console.error("Re-authentication or Deletion Failed:", error);
      let message = 'An unexpected error occurred. Please try again.';
      if (error.code) { // Firebase auth errors often have a 'code'
        switch (error.code) {
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            message = 'Incorrect email or password. Please try again.';
            break;
          case 'auth/user-mismatch':
            message = 'The credentials provided do not correspond to the current account.';
            break;
          case 'auth/too-many-requests':
            message = 'Access to this account has been temporarily disabled. Please try again later.';
            break;
          default: // Could be an auth error or an error from deleteRecord if it throws a specific type
            message = error.message || 'An error occurred during the process.';
        }
      } else {
        // Non-Firebase auth error (e.g., from deleteRecord if it throws a generic error)
        message = error.message || 'Failed to delete the record after re-authentication.';
      }
      setModalError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isModalOpen,
    recordToDelete,
    reauthEmail,
    setReauthEmail,
    reauthPassword,
    setReauthPassword,
    modalError,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };
}