// src/hooks/useRecordForm.ts
import * as React from 'react';
import { Person } from '@/pages/records/records.types';

// The hook will accept an optional initial record for editing
export const useRecordForm = (initialRecord?: Person | null) => {
  const [formData, setFormData] = React.useState<Partial<Person>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Populate the form when an initial record is provided (for editing)
  React.useEffect(() => {
    if (initialRecord) {
      setFormData(initialRecord);
    } else {
      // Set default empty state for adding a new record
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        birth: '',
        death: '',
        block: '',
        lot: undefined,
        sect: undefined,
        plot: undefined,
      });
    }
  }, [initialRecord]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Allow empty string to clear the input, otherwise parse to number
    const numValue = value === '' ? undefined : parseInt(value, 10);
    if (value === '' || !isNaN(numValue as number)) {
        setFormData(prev => ({ ...prev, [id]: numValue }));
    }
  };

  // The save function is passed in from the component using the hook
  const handleSave = async (saveFn: (data: Partial<Person>) => Promise<any>) => {
    setError(null);

    // Basic Validation
    if (!formData.firstName || !formData.lastName) {
      setError("First Name and Last Name are required.");
      return;
    }

    setIsProcessing(true);
    try {
      await saveFn(formData);
      return true; // Indicate success
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      return false; // Indicate failure
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    formData,
    setFormData,
    isProcessing,
    error,
    handleInputChange,
    handleNumericInputChange,
    handleSave,
  };
};
