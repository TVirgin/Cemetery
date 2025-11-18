// src/pages/Records/AddRecord.tsx
import Layout from '@/components/layout';
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Person } from '@/pages/records/records.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addRecord } from '../../services/recordService';
import { useUserAuth } from '../../context/userAuthContext';
import { useRecordForm } from '../../hooks/useRecordForm'; // Import the new hook

const AddRecord: React.FunctionComponent = () => {
  const { user } = useUserAuth();
  const {
    formData,
    isProcessing,
    error,
    handleInputChange,
    handleNumericInputChange,
    handleSave,
    setFormData,
  } = useRecordForm(); // Use the hook for form state and logic

  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to add a record.");
      return;
    }
    
    // The save function specific to adding a record
    const success = await handleSave((data) => addRecord(data as Omit<Person, 'id'| 'createdAt'>));

    if (success) {
      setSuccessMessage("Record added successfully!");
      // Reset form by re-initializing the hook's state
      setFormData({ firstName: '', middleName: '', lastName: '', birth: '', death: '', block: '', lot: undefined, sect: undefined, plot: undefined});
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center w-full py-8 md:py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Add New Cemetery Record</CardTitle>
            <CardDescription>Fill in the details for the new record.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={formData.firstName || ''} onChange={handleInputChange} disabled={isProcessing} required />
                  </div>
                  <div className="space-y-1.5">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={formData.lastName || ''} onChange={handleInputChange} disabled={isProcessing} required />
                  </div>
                  <div className="space-y-1.5">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input id="middleName" value={formData.middleName || ''} onChange={handleInputChange} disabled={isProcessing} />
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                      <Label htmlFor="birth">Birth Date</Label>
                      <Input id="birth" value={formData.birth || ''} onChange={handleInputChange} placeholder="YYYY-MM-DD" disabled={isProcessing} />
                  </div>
                  <div className="space-y-1.5">
                      <Label htmlFor="death">Death Date</Label>
                      <Input id="death" value={formData.death || ''} onChange={handleInputChange} placeholder="YYYY-MM-DD" disabled={isProcessing} />
                  </div>
              </div>
              <div className="pt-4 border-t">
                  <h4 className="text-md font-medium text-gray-800 mb-2">Location</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                          <Label htmlFor="block">Block</Label>
                          <Input id="block" value={formData.block || ''} onChange={handleInputChange} disabled={isProcessing} />
                      </div>
                      <div className="space-y-1.5">
                          <Label htmlFor="lot">Lot</Label>
                          <Input id="lot" type="number" value={formData.lot ?? ''} onChange={handleNumericInputChange} disabled={isProcessing} />
                      </div>
                      <div className="space-y-1.5">
                          <Label htmlFor="pos">Position</Label>
                          <Input id="pos" type="number" value={formData.sect ?? ''} onChange={handleNumericInputChange} disabled={isProcessing} />
                      </div>
                      <div className="space-y-1.5">
                          <Label htmlFor="plot">Plot</Label>
                          <Input id="plot" type="number" value={formData.plot ?? ''} onChange={handleNumericInputChange} disabled={isProcessing} />
                      </div>
                  </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-6">
              <Button variant="outline" type="button" onClick={() => window.history.back()} disabled={isProcessing}>Cancel</Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Adding...' : 'Add Record'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AddRecord;
