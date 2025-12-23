import React from 'react';
import { CellValue, GroupType, MapSize } from '../utils/kmap-utils';

interface FillingStepProps {
  kMap: CellValue[][];
  mapSize: MapSize;
  userMinterms: number[];  // Mảng các số cần điền 1
  userDontCares: number[];  // Mảng các số cần điền X
  groups: GroupType[];
  activeGroup: number | null;
  fullscreen: boolean;
  thinking: boolean;
  validationMessage: string | null;
  validationError: string | null;
  handleCellClick: (row: number, col: number) => void;
  setFullscreen: (fullscreen: boolean) => void;
  resetKMap: () => void;
  validateKMap: () => void;
}

export const FillingStep: React.FC<FillingStepProps> = ({
  kMap,
  mapSize,
  userMinterms,
  userDontCares,
  groups,
  activeGroup,
  fullscreen,
  thinking,
  validationMessage,
  validationError,
  handleCellClick,
  setFullscreen,
  resetKMap,
  validateKMap
}) => {
  const rows = kMap.length;
  const cols = kMap[0].length;

  // Define Gray code order
  const grayCodeOrder = ['00', '01', '11', '10'];
  
  // Define index mapping for 4x4 K-map
  const indexMapping = [
    [0, 1, 3, 2],    // 00
    [4, 5, 7, 6],    // 01
    [12, 13, 15, 14], // 11
    [8, 9, 11, 10]   // 10
  ];

  // Helper function to get cell color based on value
  const getCellColor = (value: CellValue) => {
    switch (value) {
      case '1': return 'text-yellow-500 font-bold';
      case 'X': return 'text-blue-500 font-bold';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Fill in the K-Map</h3>
        <button
          className="text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setFullscreen(!fullscreen)}
        >
          {fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Instructions */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <h4 className="font-medium">Instructions:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Click cells to cycle through values: 0 → 1 → X → 0</li>
            <li>Use <span className="text-yellow-500 font-bold">1</span> for minterms</li>
            <li>Use <span className="text-blue-500 font-bold">X</span> for don't care terms</li>
            <li>Leave <span className="text-gray-700">0</span> for all other cells</li>
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Cell numbers are shown in the bottom-right corner of each cell
          </div>
          <button
            className="px-3 py-1 text-sm rounded-md border border-input hover:bg-accent hover:text-accent-foreground"
            onClick={resetKMap}
          >
            Reset
          </button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border bg-gray-800 text-white p-2 text-center" style={{ width: '100px' }}>
                  <div className="flex items-center justify-center">
                    <div className="transform -rotate-45 whitespace-nowrap">AB</div>
                    <div className="ml-2 transform rotate-45">CD</div>
                  </div>
                </th>
                {grayCodeOrder.map((cd, index) => (
                  <th key={index} className="border bg-gray-800 text-white p-2 text-center" style={{ width: '100px' }}>
                    {cd}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grayCodeOrder.map((rowLabel, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border p-2 text-center font-medium bg-gray-100" style={{ width: '100px' }}>
                    {rowLabel}
                  </td>
                  {grayCodeOrder.map((_, colIndex) => {
                    const actualRowIndex = rowIndex;
                    const actualColIndex = colIndex;
                    const cell = kMap[actualRowIndex][actualColIndex];
                    const isInGroup = groups.some(group =>
                      group.cells.some(([r, c]) => r === actualRowIndex && c === actualColIndex)
                    );
                    const group = groups.find(group =>
                      group.cells.some(([r, c]) => r === actualRowIndex && c === actualColIndex)
                    );

                    return (
                      <td 
                        key={colIndex}
                        className="border p-0 text-center"
                        style={{ width: '100px', height: '100px' }}
                      >
                        <button
                          className={`
                            w-full h-full flex items-center justify-center text-lg font-medium
                            transition-colors relative
                            ${isInGroup ? group?.color : 'hover:bg-gray-50'}
                            ${getCellColor(cell)}
                          `}
                          onClick={() => handleCellClick(actualRowIndex, actualColIndex)}
                        >
                          {cell}
                          <div className="absolute bottom-1 right-1 text-[10px] text-gray-400">
                            {indexMapping[rowIndex][colIndex]}
                          </div>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Validation message */}
        {(validationMessage || validationError) && (
          <div className={`p-3 rounded-md text-sm ${
            validationError ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
          }`}>
            {validationMessage || validationError}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={validateKMap}
            disabled={thinking}
          >
            {thinking ? 'Checking...' : 'Check & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};