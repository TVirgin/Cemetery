// src/components/records/RecordsTableDisplay.tsx
import * as React from 'react';
import { Table, flexRender } from '@tanstack/react-table';
import { Person } from '@/pages/records/records.types'; // Adjust path
import { ChevronsUpDown, ArrowUpNarrowWide, ArrowDownWideNarrow } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordsTableDisplayProps {
  table: Table<Person>;
  onRowClick: (person: Person) => void;
}

export const RecordsTableDisplay: React.FC<RecordsTableDisplayProps> = ({ table, onRowClick }) => {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  scope="col"
                  style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap border-b-2 border-gray-200",
                    header.column.getCanSort() ? "cursor-pointer select-none hover:bg-gray-200" : ""
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center space-x-1">
                    <span>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </span>
                    {/* Display Sorting Icon */}
                    {header.column.getCanSort() && (
                      <span>
                        {{
                          asc: <ArrowUpNarrowWide size={14} className="text-gray-700" />,
                          desc: <ArrowDownWideNarrow size={14} className="text-gray-700" />,
                        }[header.column.getIsSorted() as string] ?? <ChevronsUpDown size={14} className="text-gray-400" />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row.original)}
                className="odd:bg-white even:bg-gray-50 hover:bg-sky-100 transition-colors duration-150 cursor-pointer"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }}
                    className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // This part is now handled by the parent component, but it's good practice
            // to keep a fallback message in case the component is ever used elsewhere.
            // The parent's "No records found" will display more prominently.
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="px-6 py-10 text-center text-sm text-gray-500"
              >
                No data to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
