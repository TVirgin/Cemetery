import * as React from 'react';
import { RecordSearchFilters } from './records.types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

interface RecordSearchFormProps {
  initialFilters: RecordSearchFilters;
  onSearch: (filters: RecordSearchFilters) => void;
  onReset: () => void;
}

export const RecordSearchForm: React.FC<RecordSearchFormProps> = ({ initialFilters, onSearch, onReset }) => {
  const [searchFilters, setSearchFilters] = React.useState<RecordSearchFilters>(initialFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchFilters);
  };

  const handleReset = () => {
    setSearchFilters(initialFilters);
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
      {/* First Name */}
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" placeholder="Search first name..." value={searchFilters.firstName} onChange={handleInputChange} />
      </div>
      {/* Last Name */}
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" placeholder="Search last name..." value={searchFilters.lastName} onChange={handleInputChange} />
      </div>
      {/* Birth Date */}
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="birthDate">Birth Date</Label>
        <Input id="birthDate" placeholder="YYYY-MM-DD" value={searchFilters.birthDate} onChange={handleInputChange} />
      </div>
      {/* Death Date */}
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="deathDate">Death Date</Label>
        <Input id="deathDate" placeholder="YYYY-MM-DD" value={searchFilters.deathDate} onChange={handleInputChange} />
      </div>
      <div className="flex space-x-2 sm:col-span-2 md:col-span-2 lg:col-span-4 lg:justify-start mt-4 lg:mt-0">
        <Button type="submit" className="flex items-center"><Search size={18} className="mr-2" /> Search</Button>
        <Button type="button" variant="outline" onClick={handleReset} className="flex items-center"><RotateCcw size={18} className="mr-2" /> Reset</Button>
      </div>
    </form>
  );
};