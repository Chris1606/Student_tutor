import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, X } from 'lucide-react';

interface KmapCanvasProps {
  variables: number;
  minterms: number[];
  dontCares: number[];
  onSubmit: (answer: string) => void;
}

interface Cell {
  value: string; // '0', '1', or 'X'
  index: number;
  binary: string;
}

const KmapCanvas: React.FC<KmapCanvasProps> = ({ variables, minterms, dontCares, onSubmit }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [cells, setCells] = useState<Cell[]>([]);
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
  const [selectedValue, setSelectedValue] = useState<string>('1');

  // Initialize K-map grid
  useEffect(() => {
    const rows = variables === 3 ? 2 : 4;
    const cols = 4;
    setGridSize({ rows, cols });

    // Create cells with binary representations
    const grayCode = variables === 3 
      ? ['00', '01', '11', '10']
      : ['00', '01', '11', '10'].flatMap(ab => ['00', '01', '11', '10'].map(cd => ab + cd));

    const newCells = Array(Math.pow(2, variables)).fill(null).map((_, index) => ({
      value: minterms.includes(index) ? '1' : dontCares.includes(index) ? 'X' : '0',
      index,
      binary: grayCode[index]
    }));
    setCells(newCells);
  }, [variables, minterms, dontCares]);

  const handleCellClick = (index: number) => {
    if (!isStarted) return;
    
    setCells(prev => prev.map(cell => 
      cell.index === index ? { ...cell, value: selectedValue } : cell
    ));
  };

  const handleSubmit = () => {
    const isCorrect = cells.every(cell => {
      if (minterms.includes(cell.index)) return cell.value === '1';
      if (dontCares.includes(cell.index)) return cell.value === 'X';
      return cell.value === '0';
    });
    onSubmit(isCorrect ? "Correct!" : "Try again!");
  };

  const renderGrid = () => {
    const headerStyle = "text-center font-medium text-sm text-gray-600 p-2";
    const cellStyle = "w-16 h-16 border border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative";
    const valueStyle = "text-xl font-semibold";
    const indexStyle = "text-xs text-gray-500 absolute bottom-1 right-1";

    return (
      <div className="mt-4">
        {/* Column Headers */}
        <div className="flex">
          <div className="w-16"></div> {/* Empty corner cell */}
          <div className="flex-1 grid grid-cols-4">
            {['00', '01', '11', '10'].map(ab => (
              <div key={ab} className={headerStyle}>ab = {ab}</div>
            ))}
          </div>
        </div>

        {/* Grid with Row Headers */}
        {variables === 4 ? (
          // 4-variable K-map
          ['00', '01', '11', '10'].map((cd, rowIndex) => (
            <div key={cd} className="flex">
              <div className={headerStyle + " w-16"}>cd = {cd}</div>
              <div className="flex-1 grid grid-cols-4">
                {['00', '01', '11', '10'].map((ab, colIndex) => {
                  const index = rowIndex * 4 + colIndex;
                  const cell = cells[index];
                  return (
                    <div
                      key={`${cd}${ab}`}
                      className={`${cellStyle} ${!isStarted ? 'cursor-not-allowed opacity-50' : ''}`}
                      onClick={() => handleCellClick(index)}
                    >
                      <span className={valueStyle}>{cell?.value}</span>
                      <span className={indexStyle}>{index}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          // 3-variable K-map
          ['0', '1'].map((c, rowIndex) => (
            <div key={c} className="flex">
              <div className={headerStyle + " w-16"}>c = {c}</div>
              <div className="flex-1 grid grid-cols-4">
                {['00', '01', '11', '10'].map((ab, colIndex) => {
                  const index = rowIndex * 4 + colIndex;
                  const cell = cells[index];
                  return (
                    <div
                      key={`${c}${ab}`}
                      className={`${cellStyle} ${!isStarted ? 'cursor-not-allowed opacity-50' : ''}`}
                      onClick={() => handleCellClick(index)}
                    >
                      <span className={valueStyle}>{cell?.value}</span>
                      <span className={indexStyle}>{index}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-gray-50">
      {/* Panel Toggle Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {showPanel ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        <span>Instructions</span>
      </button>

      {/* Sliding Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 left-0 right-0 bg-white shadow-lg rounded-b-lg p-6"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Fill the Karnaugh Map</h2>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">Fill the K-Map by clicking cells to toggle between values:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Enter 1 for minterms ({minterms.join(', ')})</li>
                  <li>Enter X for don't care terms ({dontCares.join(', ')})</li>
                  <li>Leave 0 for all other cells</li>
                </ul>

                {!isStarted && (
                  <button
                    onClick={() => setIsStarted(true)}
                    className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Start Filling K-Map
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`p-6 ${showPanel ? 'mt-64' : 'mt-16'}`}>
        {/* Value Selection */}
        {isStarted && (
          <div className="mb-4 flex items-center gap-4">
            <span className="text-gray-700">Select value to enter:</span>
            {['1', 'X', '0'].map(value => (
              <button
                key={value}
                onClick={() => setSelectedValue(value)}
                className={`px-4 py-2 rounded-lg ${
                  selectedValue === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        )}

        {/* K-map Grid */}
        {renderGrid()}

        {/* Submit Button */}
        {isStarted && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Validate K-Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KmapCanvas;