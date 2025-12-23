import React from 'react';
import { CellValue, GroupType, MapSize } from '../utils/kmap-utils';

interface GroupingStepProps {
  kMap: CellValue[][];
  mapSize: MapSize;
  groups: GroupType[];
  activeGroup: number | null;
  fullscreen: boolean;
  thinking: boolean;
  validationMessage: string | null;
  validationError: string | null;
  handleGroupCellClick: (row: number, col: number) => void;
  setFullscreen: (fullscreen: boolean) => void;
  setActiveGroup: (group: number | null) => void;
  addGroup: () => void;
  deleteActiveGroup: () => void;
  resetGroups: () => void;
  validateGrouping: () => void;
}

export const GroupingStep: React.FC<GroupingStepProps> = ({
  kMap,
  mapSize,
  groups,
  activeGroup,
  fullscreen,
  thinking,
  validationMessage,
  validationError,
  handleGroupCellClick,
  setFullscreen,
  setActiveGroup,
  addGroup,
  deleteActiveGroup,
  resetGroups,
  validateGrouping
}) => {
  const rows = kMap.length;
  const cols = kMap[0].length;

  // Generate row and column labels
  const rowLabels = Array(rows).fill(0).map((_, i) => {
    const binary = i.toString(2).padStart(2, '0');
    return binary;
  });

  const colLabels = Array(cols).fill(0).map((_, i) => {
    const binary = i.toString(2).padStart(2, '0');
    return binary;
  });

  // Thêm Gray code order và index mapping giống như FillingStep
  const grayCodeOrder = ['00', '01', '11', '10'];
  
  const indexMapping = [
    [0, 1, 3, 2],    // 00
    [4, 5, 7, 6],    // 01
    [12, 13, 15, 14], // 11
    [8, 9, 11, 10]   // 10
  ];

  // Helper function để lấy màu cell dựa trên giá trị
  const getCellColor = (value: CellValue) => {
    switch (value) {
      case '1': return 'text-yellow-500 font-bold';
      case 'X': return 'text-blue-500 font-bold';
      default: return 'text-gray-700';
    }
  };

  // Định nghĩa một mảng các màu gradient đẹp cho các nhóm
  const groupColors = [
    'from-pink-200/50 to-pink-300/50',
    'from-blue-200/50 to-blue-300/50',
    'from-green-200/50 to-green-300/50',
    'from-purple-200/50 to-purple-300/50',
    'from-yellow-200/50 to-yellow-300/50',
    'from-cyan-200/50 to-cyan-300/50',
  ];

  // Sửa lại hàm getCellGroupStyles
  const getCellGroupStyles = (rowIndex: number, colIndex: number) => {
    const cellGroups = groups.filter(group => 
      group.cells.some(([r, c]) => r === rowIndex && c === colIndex)
    );

    if (cellGroups.length === 0) return '';

    // Nếu cell thuộc nhiều nhóm, tạo gradient từ các màu của các nhóm
    if (cellGroups.length > 1) {
      const gradientColors = cellGroups.map(group => groupColors[group.id % groupColors.length]);
      const gradientStops = gradientColors.map((color, index) => {
        const percentage = (index / (gradientColors.length - 1)) * 100;
        return `${color} ${percentage}%`;
      }).join(', ');

      return `
        bg-gradient-to-r ${gradientStops}
        ${activeGroup && cellGroups.some(g => g.id === activeGroup) ? 'ring-2 ring-primary' : ''}
      `;
    }

    // Nếu chỉ thuộc 1 nhóm
    const group = cellGroups[0];
    return `
      bg-gradient-to-r ${groupColors[group.id % groupColors.length]}
      ${activeGroup === group.id ? 'ring-2 ring-primary' : ''}
    `;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Group the Terms</h3>
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
            <li>Click to add/remove cells from the active group</li>
            <li>Groups can overlap and share cells</li>
            <li>Each group must be a rectangle with size 2^n</li>
            <li>Try to cover all 1's and X's with minimal groups</li>
          </ul>
        </div>

        {/* K-map table */}
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
                    const cell = kMap[rowIndex][colIndex];
                    const groupStyles = getCellGroupStyles(rowIndex, colIndex);

                    return (
                      <td 
                        key={colIndex}
                        className="border p-0 text-center"
                        style={{ width: '100px', height: '100px' }}
                      >
                        <button
                          className={`
                            w-full h-full flex items-center justify-center text-lg font-medium
                            transition-all relative overflow-hidden
                            ${groupStyles}
                            ${cell === '0' ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50/30'}
                            ${getCellColor(cell)}
                          `}
                          onClick={() => handleGroupCellClick(rowIndex, colIndex)}
                          disabled={cell === '0'}
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

        {/* Group controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={addGroup}
          >
            + New Group
          </button>
          {groups.map(group => (
            <button
              key={group.id}
              className={`
                px-3 py-1 text-sm rounded-md border transition-all
                ${groupColors[group.id % groupColors.length]}
                ${activeGroup === group.id 
                  ? 'ring-2 ring-primary shadow-md' 
                  : 'hover:ring-2 hover:ring-primary/50'
                }
              `}
              onClick={() => setActiveGroup(activeGroup === group.id ? null : group.id)}
            >
              Group {group.id}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm rounded-md border border-input hover:bg-accent hover:text-accent-foreground"
              onClick={resetGroups}
            >
              Reset Groups
            </button>
            {activeGroup !== null && (
              <button
                className="px-3 py-1 text-sm rounded-md border border-destructive text-destructive hover:bg-destructive/10"
                onClick={deleteActiveGroup}
              >
                Delete Group {activeGroup}
              </button>
            )}
          </div>
          <button
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={validateGrouping}
            disabled={thinking || groups.length === 0}
          >
            {thinking ? 'Checking...' : 'Check & Continue'}
          </button>
        </div>

        {/* Validation messages */}
        {validationMessage && (
          <div className={`p-3 rounded-md text-sm ${
            validationError ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
          }`}>
            {validationMessage}
          </div>
        )}
      </div>
    </div>
  );
}; 