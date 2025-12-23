import React from 'react';
import { CellValue, GroupType, MapSize } from '../utils/kmap-utils';

interface ReviewStepProps {
  kMap: CellValue[][];
  mapSize: MapSize;
  groups: GroupType[];
  activeGroup: number | null;
  booleanFunction: string;
  userExpression: string;
  onResetProblem: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  kMap,
  mapSize,
  groups,
  activeGroup,
  booleanFunction,
  userExpression,
  onResetProblem
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Solution Review</h3>
      </div>

      <div className="space-y-4">
        {/* Problem statement */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Original Boolean Function:</p>
          <code className="text-sm">{booleanFunction}</code>
        </div>

        {/* Solution */}
        <div className="p-4 bg-primary/10 text-primary rounded-lg">
          <p className="text-sm font-medium mb-2">Simplified Expression:</p>
          <code className="text-sm">{userExpression}</code>
        </div>

        {/* K-map visualization */}
        <div className="relative">
          {/* Column labels */}
          <div className="flex justify-end mb-2">
            <div className="w-8" /> {/* Spacer for row labels */}
            {colLabels.map((label, i) => (
              <div key={i} className="w-12 text-center text-sm">
                {label}
              </div>
            ))}
          </div>

          {/* K-map grid */}
          <div className="grid gap-1">
            {kMap.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center">
                {/* Row label */}
                <div className="w-8 text-right text-sm pr-2">
                  {rowLabels[rowIndex]}
                </div>

                {/* Row cells */}
                <div className="flex">
                  {row.map((cell, colIndex) => {
                    const isInGroup = groups.some(group =>
                      group.cells.some(([r, c]) => r === rowIndex && c === colIndex)
                    );
                    const group = groups.find(group =>
                      group.cells.some(([r, c]) => r === rowIndex && c === colIndex)
                    );

                    return (
                      <div
                        key={colIndex}
                        className={`
                          w-12 h-12 flex items-center justify-center text-sm font-medium
                          border rounded-md
                          ${isInGroup ? group?.color : 'bg-background'}
                          ${cell === '1' ? 'text-primary' : cell === 'X' ? 'text-muted-foreground' : 'text-foreground'}
                        `}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group explanations */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Group Explanations:</h4>
          {groups.map((group, index) => (
            <div key={group.id} className="p-3 rounded-md bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full ${group.color}`} />
                <span className="text-sm font-medium">Group {index + 1}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Covers cells: {group.cells.map(([r, c]) => `${r},${c}`).join(', ')}
              </p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
            onClick={onResetProblem}
          >
            Try Another Problem
          </button>
        </div>
      </div>
    </div>
  );
}; 