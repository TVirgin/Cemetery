// src/hooks/useRecordsData.ts
import * as React from 'react';
import { Person } from '@/pages/records/records.types';
import { getAllRecords } from '@/services/recordService';
import { User } from 'firebase/auth';

interface UseRecordsDataReturn {
  data: Person[];
  isLoadingRecords: boolean;
  fetchError: string | null;
  refetchRecords: () => void; // This will now refetch with current active filters
}

// The hook now accepts activeSearchFilters
export function useRecordsData(
  user: User | null,
  loadingAuth: boolean,
  // filters: RecordSearchFilters // Active search filters
): UseRecordsDataReturn {
  const [data, setData] = React.useState<Person[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    setIsLoadingRecords(true);
    setFetchError(null);
    try {
      let fetchedRecords: Person[];
      console.log("Fetching data:");

      fetchedRecords = await getAllRecords();

      console.log("fetched records: ");
      console.log(fetchedRecords);
      setData(fetchedRecords);
    } catch (error: any) {
      console.error("Error fetching records in hook:", error);
      setFetchError(error.message || "Failed to fetch records.");
    } finally {
      setIsLoadingRecords(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (!loadingAuth) {
      loadData();
    } else {
      setData([]);
      setIsLoadingRecords(true);
      setFetchError(null);
    }
  }, [loadingAuth, loadData]);

  return { data, isLoadingRecords, fetchError, refetchRecords: loadData };
}