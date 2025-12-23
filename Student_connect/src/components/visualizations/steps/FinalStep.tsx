import React from 'react';
import { CellValue, GroupType, MapSize } from '../utils/kmap-utils';

interface FinalStepProps {
  kMap: CellValue[][];
  mapSize: MapSize;
  groups: GroupType[];
  activeGroup: number | null;
  booleanFunction: string;
  userExpression: string;
  onResetProblem: () => void;
  onReview: () => void;
}

export const FinalStep: React.FC<FinalStepProps> = ({
  kMap,
  mapSize,
  groups,
  activeGroup,
  booleanFunction,
  userExpression,
  onResetProblem,
  onReview
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
        <h3 className="text-lg font-semibold">Congratulations!</h3>
      </div>

      <div className="space-y-4">
        {/* Success message */}
        <div className="p-4 bg-primary/10 text-primary rounded-lg">
          <p className="text-sm">
            You've successfully simplified the boolean function:
          </p>
          <div className="mt-2 p-3 bg-background rounded-md">
            <code className="text-sm">{booleanFunction}</code>
          </div>
          <p className="mt-2 text-sm">
            To the simplified expression:
          </p>
          <div className="mt-2 p-3 bg-background rounded-md">
            <code className="text-sm">{userExpression}</code>
          </div>
        </div>

        {/* K-map visualization */}
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
                    const cellGroups = groups.filter(group =>
                      group.cells.some(([r, c]) => r === actualRowIndex && c === actualColIndex)
                    );
                    const isInActiveGroup = activeGroup !== null && cellGroups.some(g => g.id === activeGroup);

                    return (
                      <td 
                        key={colIndex}
                        className="border p-0 text-center relative"
                        style={{ width: '100px', height: '100px' }}
                      >
                        <div
                          className={`
                            w-full h-full flex items-center justify-center text-lg relative
                            ${cellGroups.length > 0 ? cellGroups[0].color : 'hover:bg-gray-50'}
                            ${getCellColor(cell)}
                            ${isInActiveGroup ? 'ring-2 ring-primary ring-offset-2' : ''}
                            transition-all duration-200
                          `}
                          onMouseEnter={() => {
                            // Highlight all cells in the same groups
                            cellGroups.forEach(group => {
                              group.cells.forEach(([r, c]) => {
                                const element = document.querySelector(`[data-cell="${r}-${c}"]`);
                                if (element) {
                                  element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                                }
                              });
                            });
                          }}
                          onMouseLeave={() => {
                            // Remove highlight from all cells
                            document.querySelectorAll('[data-cell]').forEach(element => {
                              element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                            });
                          }}
                          data-cell={`${actualRowIndex}-${actualColIndex}`}
                        >
                          {cell}
                          <div className="absolute bottom-1 right-1 text-[10px] text-gray-400">
                            {indexMapping[rowIndex][colIndex]}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-foreground bg-background border rounded-md hover:bg-accent hover:text-accent-foreground"
            onClick={onResetProblem}
          >
            Try Another Problem
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
            onClick={onReview}
          >
            Review Solution
          </button>
        </div>
      </div>
    </div>
  );
}; 