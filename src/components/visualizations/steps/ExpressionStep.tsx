import React from 'react';
import { CellValue, GroupType, MapSize } from '../utils/kmap-utils';

interface ExpressionStepProps {
  kMap: CellValue[][];
  mapSize: MapSize;
  groups: GroupType[];
  activeGroup: number | null;
  thinking: boolean;
  validationMessage: string | null;
  expressionCorrect: boolean | null;
  userExpression: string;
  setUserExpression: (expression: string) => void;
  validateExpression: () => void;
}

export const ExpressionStep: React.FC<ExpressionStepProps> = ({
  kMap,
  mapSize,
  groups,
  activeGroup,
  thinking,
  validationMessage,
  expressionCorrect,
  userExpression,
  setUserExpression,
  validateExpression
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
        <h3 className="text-lg font-semibold">Write the Simplified Expression</h3>
      </div>

      <div className="space-y-4">
        {/* Instructions */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <h4 className="font-medium">Instructions:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Review your groups in the K-map</li>
            <li>Write the boolean expression for each group</li>
            <li>Combine expressions with + (OR) operator</li>
          </ul>
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

        {/* Expression input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Enter the simplified boolean expression:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userExpression}
              onChange={(e) => setUserExpression(e.target.value)}
              placeholder="e.g., AB + BC"
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={thinking}
            />
            <button
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={validateExpression}
              disabled={thinking || !userExpression}
            >
              {thinking ? 'Checking...' : 'Check'}
            </button>
          </div>
        </div>

        {/* Validation message */}
        {validationMessage && (
          <div className={`p-3 rounded-md text-sm ${
            expressionCorrect === false ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
          }`}>
            {validationMessage}
          </div>
        )}

        {/* Expression format help */}
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Expression Format:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use capital letters for variables (A, B, C, D)</li>
            <li>Use + for OR operations</li>
            <li>Use no symbol for AND operations</li>
            <li>Use ' for NOT operations</li>
            <li>Example: AB'C + A'BC</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 