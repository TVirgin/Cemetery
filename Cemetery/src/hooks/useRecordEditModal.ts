// src/hooks/useRecordEditModal.ts
import { useState } from 'react';
import { Person } from '@/pages/records/records.types';

export const useRecordEditModal = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<Person | null>(null);

  const openEditModal = (record: Person) => {
    setRecordToEdit(record);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setRecordToEdit(null);
  };

  return {
    isEditModalOpen,
    recordToEdit,
    openEditModal,
    closeEditModal,
  };
};
