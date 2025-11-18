import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw, MapPin, PlusCircle } from "lucide-react";
import { RecordSearchFilters } from '@/pages/records/records.types'; // Adjust path
import { User } from 'firebase/auth'; // Or your custom User type
import { useNavigate } from 'react-router-dom';

interface RecordsHeaderProps {
  user: User | null;
  role?: string | null; // Pass role for permissions
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  searchFilters: RecordSearchFilters;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onResetSearch: () => void;
}

export const RecordsHeader: React.FC<RecordsHeaderProps> = ({
  user,
  role,
  showMap,
  setShowMap,
  searchFilters,
  onSearchChange,
  onSearchSubmit,
  onResetSearch,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          {user ? `${user.displayName || 'User'}'s Records` : "Public Records"}
        </h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setShowMap(!showMap)} className="flex items-center flex-grow sm:flex-grow-0">
            <MapPin size={18} className="mr-2" /> {showMap ? "Hide Map" : "Show Map"}
          </Button>
          {user && role === 'admin' && (
            <Button onClick={() => navigate('/admin/record')} className="flex items-center flex-grow sm:flex-grow-0">
              <PlusCircle size={18} className="mr-2"/> Add New Record
            </Button>
          )}
        </div>
      </div>
      <form onSubmit={onSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="Search first name..." value={searchFilters.firstName} onChange={onSearchChange} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Search last name..." value={searchFilters.lastName} onChange={onSearchChange} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input id="birthDate" type="date" value={searchFilters.birthDate} onChange={onSearchChange} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="deathDate">Death Date</Label>
          <Input id="deathDate" type="date" value={searchFilters.deathDate} onChange={onSearchChange} />
        </div>
        <div className="flex space-x-2 sm:col-span-2 md:col-span-2 lg:col-span-4 lg:justify-start mt-4 lg:mt-0">
          <Button type="submit" className="flex items-center"><Search size={18} className="mr-2" /> Search</Button>
          <Button type="button" variant="outline" onClick={onResetSearch} className="flex items-center"><RotateCcw size={18} className="mr-2" /> Reset</Button>
        </div>
      </form>
    </div>
  );
};