export type Person = {
    id: string; 
    firstName: string;
    middleName: string;
    lastName: string;
    birth: string;
    death: string;
    block: string;
    lot: number;
    plot: number;
    // Layout of some blocks are different and follow Block -> Lot -> Section -> Plot
    sect: number;
  };


export interface RecordSearchFilters {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  deathDate?: string;
}

export interface BlockLayout {
  id: string;
  lotCount: number;
  plotCount: number; 
  sectionCount: number;
  lotColumns?: number; // NEW: Number of columns for lots (e.g., 1 or 2)
  hasSection: boolean;
}

export interface PlotIdentifier {
  block: string;    
  lot: number;      
  plot: number;
  sect: number;      
  rawId: string; 
}