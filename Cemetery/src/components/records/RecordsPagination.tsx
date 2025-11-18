// src/components/records/RecordsPagination.tsx
import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { Person } from '@/pages/records/records.types'; // Adjust path

interface RecordsPaginationProps {
  table: Table<Person>;
}

export const RecordsPagination: React.FC<RecordsPaginationProps> = ({ table }) => {
  if (table.getPageCount() <= 1 && table.getRowModel().rows.length === 0 && table.getState().pagination.pageIndex === 0) { // Don't show pagination if only one page or no data
      if(table.getRowModel().rows.length <= table.getState().pagination.pageSize && table.getState().pagination.pageIndex === 0) return null;
  }


  return (
    <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'<< First'}</button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'< Previous'}</button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'Next >'}</button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">{'Last >>'}</button>
      </div>
      <span className="flex items-center gap-1 text-xs text-gray-700">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </strong>
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-700 hidden sm:inline">Go to page:</span>
        <input
          type="number"
          min={1}
          max={table.getPageCount()}
          value={table.getState().pagination.pageIndex + 1} // Controlled component
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            if (page >= 0 && page < table.getPageCount()) {
              table.setPageIndex(page);
            }
          }}
          className="w-16 px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => { table.setPageSize(Number(e.target.value)); }}
          className="px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {[10, 20, 30, 40, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}> Show {pageSize} </option>
          ))}
        </select>
      </div>
    </div>
  );
};