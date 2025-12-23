// Types
export type CellValue = '0' | '1' | 'X';
export type StepType = 'intro' | 'filling' | 'grouping' | 'expression' | 'final' | 'review';
export type MapSize = '2x2' | '2x4' | '4x4';

export interface GroupType {
  id: number;
  cells: [number, number][];
  color: string;
}

export interface GroupColor {
  bg: string;
  border: string;
}

// Colors for different groups
export const groupColors: GroupColor[] = [
  { bg: 'bg-blue-100', border: 'border-blue-500' },
  { bg: 'bg-green-100', border: 'border-green-500' },
  { bg: 'bg-yellow-100', border: 'border-yellow-500' },
  { bg: 'bg-red-100', border: 'border-red-500' },
  { bg: 'bg-purple-100', border: 'border-purple-500' },
  { bg: 'bg-pink-100', border: 'border-pink-500' },
];

// Parse boolean function string into minterms and don't cares
export function parseBooleanFunction(func: string): { minterms: number[]; dontCares: number[] } {
  const minterms: number[] = [];
  const dontCares: number[] = [];
  
  // Extract minterms
  const mintermMatch = func.match(/Σm\((.*?)\)/);
  if (mintermMatch) {
    minterms.push(...mintermMatch[1].split(',').map(n => parseInt(n.trim())));
  }
  
  // Extract don't cares
  const dontCareMatch = func.match(/Σd\((.*?)\)/);
  if (dontCareMatch) {
    dontCares.push(...dontCareMatch[1].split(',').map(n => parseInt(n.trim())));
  }
  
  return { minterms, dontCares };
}

// Convert decimal number to binary and return row and column indices
export function decimalToBinary(decimal: number): [number, number] {
  const binary = decimal.toString(2).padStart(4, '0');
  const row = parseInt(binary.slice(0, 2), 2);
  const col = parseInt(binary.slice(2), 2);
  return [row, col];
}

// Convert binary row and column to decimal number
export function binaryToDecimal(row: number, col: number): number {
  const binary = row.toString(2).padStart(2, '0') + col.toString(2).padStart(2, '0');
  return parseInt(binary, 2);
}

// Generate simplified expression from groups
export function generateExpression(groups: GroupType[]): string {
  if (groups.length === 0) return '0';
  
  const terms = groups.map(group => {
    const cells = group.cells;
    if (cells.length === 0) return '';
    
    // Get row and column ranges
    const rows = cells.map(([r]) => r);
    const cols = cells.map(([_, c]) => c);
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);
    
    // Determine variables based on group size
    const variables: string[] = [];
    
    // Check row variables
    if (maxRow - minRow === 1) {
      variables.push(minRow === 0 ? 'A' : 'a');
    }
    
    // Check column variables
    if (maxCol - minCol === 1) {
      variables.push(minCol === 0 ? 'B' : 'b');
    }
    
    // Add remaining variables based on group size
    if (cells.length === 4) {
      variables.push('C');
    }
    
    return variables.join('');
  });
  
  return terms.filter(term => term !== '').join(' + ');
}

// Check if a group is valid (covers only 1s and Xs)
export function isValidGroup(kMap: CellValue[][], group: GroupType): boolean {
  return group.cells.every(([row, col]) => {
    return kMap[row][col] === '1' || kMap[row][col] === 'X';
  });
}

// Check if a group is minimal (cannot be expanded further)
export function isMinimalGroup(kMap: CellValue[][], group: GroupType): boolean {
  const rows = kMap.length;
  const cols = kMap[0].length;
  
  // Try expanding in each direction
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];
  
  for (const [dr, dc] of directions) {
    const expandedCells = group.cells.map(([r, c]) => [r + dr, c + dc]);
    
    // Check if expansion is valid
    const isValidExpansion = expandedCells.every(([r, c]) => {
      return r >= 0 && r < rows && c >= 0 && c < cols &&
             (kMap[r][c] === '1' || kMap[r][c] === 'X');
    });
    
    if (isValidExpansion) {
      return false; // Group can be expanded
    }
  }
  
  return true; // Group is minimal
}

// Check if all 1s are covered by groups
export function areAllOnesCovered(kMap: CellValue[][], groups: GroupType[]): boolean {
  const rows = kMap.length;
  const cols = kMap[0].length;
  
  // Create a set of covered cells
  const coveredCells = new Set<string>();
  groups.forEach(group => {
    group.cells.forEach(([r, c]) => {
      coveredCells.add(`${r},${c}`);
    });
  });
  
  // Check if all 1s are covered
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (kMap[r][c] === '1' && !coveredCells.has(`${r},${c}`)) {
        return false;
      }
    }
  }
  
  return true;
}

// Check if groups overlap
export function doGroupsOverlap(groups: GroupType[]): boolean {
  const coveredCells = new Set<string>();
  
  for (const group of groups) {
    for (const [r, c] of group.cells) {
      const cellKey = `${r},${c}`;
      if (coveredCells.has(cellKey)) {
        return true;
      }
      coveredCells.add(cellKey);
    }
  }
  
  return false;
}

// Check if a group is redundant (all its cells are covered by other groups)
export function isGroupRedundant(groups: GroupType[], groupIndex: number): boolean {
  const targetGroup = groups[groupIndex];
  const otherGroups = groups.filter((_, i) => i !== groupIndex);
  
  // Create a set of cells covered by other groups
  const coveredCells = new Set<string>();
  otherGroups.forEach(group => {
    group.cells.forEach(([r, c]) => {
      coveredCells.add(`${r},${c}`);
    });
  });
  
  // Check if all cells in the target group are covered
  // Chỉ kiểm tra các cell có giá trị là 1
  return targetGroup.cells.every(([r, c]) => {
    const cellKey = `${r},${c}`;
    return coveredCells.has(cellKey);
  });
} 