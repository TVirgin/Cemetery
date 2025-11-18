// src/features/records/recordTable.config.ts
import { ColumnDef } from '@tanstack/react-table';
import { Person } from './records.types'; // Import your new Person type

export const staticPersonColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName', // Accesses the `firstName` property from your Person object
    header: 'First Name',     // Text displayed in the table header for this column
    cell: info => info.getValue(), // Gets the value from accessorKey and renders it. For a string, this is perfect.
    footer: props => props.column.id, // Optional: Displays the column's ID in the footer
  },
  {
    // accessorFn is used when you need to compute a value or access a nested property
    // For a direct property like middleName, accessorKey: 'middleName' is often simpler
    accessorFn: row => row.middleName,
    id: 'middleName', // Explicit ID for the column (good practice with accessorFn)
                      // Could also be 'middleName' to match the property
    cell: info => info.getValue(), // Renders the value returned by accessorFn
    header: () => <span>Middle Name</span>, // Header can be a string or a function returning JSX/string
    footer: props => props.column.id,
  },
  {
    accessorFn: row => row.lastName,
    id: 'lastName',
    cell: info => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: props => props.column.id,
  },
  {
    accessorKey: 'birth',
    header: 'Birth Date',
    cell: info => info.getValue(),
    footer: props => props.column.id,
  },
  {
    accessorKey: 'death', // UPDATE: Was 'Death', changed to 'death' (lowercase) to match Person type
    header: 'Death Date', // Changed header to be more generic
    cell: info => info.getValue(),
    footer: props => props.column.id,
  },
  {
    accessorKey: 'block',
    header: 'Block',
    cell: info => info.getValue(),
    footer: props => props.column.id,
  },
  {
    accessorKey: 'sect',
    header: 'Section',
    cell: info => info.getValue(),
    footer: props => props.column.id,
  },
  {
    accessorKey: 'lot',
    header: 'Lot',
    cell: info => info.getValue(),
    footer: props => props.column.id,
  },
  {
    accessorKey: 'plot',
    header: 'Plot',
    cell: info => info.getValue(), 
    footer: props => props.column.id,
  },
];