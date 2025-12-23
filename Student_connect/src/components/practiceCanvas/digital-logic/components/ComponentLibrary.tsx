import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface ComponentLibraryProps {
  visible: boolean;
  onShowLibrary: () => void;
  onStartDrag: (type: 'gate' | 'flipflop' | 'input' | 'output', subtype: string) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  visible,
  onShowLibrary,
  onStartDrag
}) => {
  const [showGateLibrary, setShowGateLibrary] = useState(true);
  const [showFlipFlopLibrary, setShowFlipFlopLibrary] = useState(false);

  if (!visible) {
    return (
      <div 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-r-md shadow-md cursor-pointer z-10"
        onClick={onShowLibrary}
        title="Hiện thư viện"
      >
        <div className="p-2">
          <ChevronRight size={16} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-24 border-r border-border bg-gray-50 flex flex-col overflow-y-auto">
      <div className="p-2">
        <button 
          onClick={() => {
            setShowGateLibrary(true);
            setShowFlipFlopLibrary(false);
          }}
          className={`text-xs w-full py-1.5 px-2 mb-1 rounded transition-colors ${showGateLibrary ? 'bg-tutu-100 text-tutu-700' : 'hover:bg-gray-200'}`}
        >
          Logic Gate
        </button>
        <button 
          onClick={() => {
            setShowGateLibrary(false);
            setShowFlipFlopLibrary(true);
          }}
          className={`text-xs w-full py-1.5 px-2 rounded transition-colors ${showFlipFlopLibrary ? 'bg-tutu-100 text-tutu-700' : 'hover:bg-gray-200'}`}
        >
          Flip Flop
        </button>
      </div>
      
      <div className="p-2 space-y-3">
        {showGateLibrary && (
          <>
            <div 
              className="p-2 bg-white border border-border rounded shadow-sm cursor-grab flex flex-col items-center"
              draggable
              onDragStart={() => onStartDrag('gate', 'AND')}
            >
              <div className="h-10 flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 60 60">
                  <path d="M10,10 L30,10 Q50,30 30,50 L10,50 Z" fill="white" stroke="black" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-xs mt-1 text-center">AND</div>
            </div>
            
            <div 
              className="p-2 bg-white border border-border rounded shadow-sm cursor-grab flex flex-col items-center"
              draggable
              onDragStart={() => onStartDrag('gate', 'OR')}
            >
              <div className="h-10 flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 60 60">
                  <path d="M10,10 Q30,10 50,30 Q30,50 10,50 Q20,30 10,10 Z" fill="white" stroke="black" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-xs mt-1 text-center">OR</div>
            </div>
            
            <div 
              className="p-2 bg-white border border-border rounded shadow-sm cursor-grab flex flex-col items-center"
              draggable
              onDragStart={() => onStartDrag('gate', 'NOT')}
            >
              <div className="h-10 flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 60 60">
                  <path d="M10,15 L40,30 L10,45 Z" fill="white" stroke="black" strokeWidth="2" />
                  <circle cx="45" cy="30" r="5" stroke="black" strokeWidth="2" fill="white" />
                </svg>
              </div>
              <div className="text-xs mt-1 text-center">NOT</div>
            </div>
            
            <div 
              className="p-2 bg-white border border-border rounded shadow-sm cursor-grab flex flex-col items-center"
              draggable
              onDragStart={() => onStartDrag('input', 'VARIABLE')}
            >
              <div className="h-10 flex items-center justify-center">
                <div style={{ 
                  width: 30, 
                  height: 20, 
                  borderRadius: '6px', 
                  background: '#f5f5f5', 
                  border: '2px solid #666', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  x
                </div>
              </div>
              <div className="text-xs mt-1 text-center">Biến</div>
            </div>
            
            <div 
              className="p-2 bg-white border border-border rounded shadow-sm cursor-grab flex flex-col items-center"
              draggable
              onDragStart={() => onStartDrag('input', 'HIGH')}
            >
              <div className="h-10 flex items-center justify-center">
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#4CAF50', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                  1
                </div>
              </div>
              <div className="text-xs mt-1 text-center">Input 1</div>
            </div>
            
            <div 
              className="p-2 bg-white border border-border rounded shadow-sm cursor-grab flex flex-col items-center"
              draggable
              onDragStart={() => onStartDrag('input', 'LOW')}
            >
              <div className="h-10 flex items-center justify-center">
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f44336', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                  0
                </div>
              </div>
              <div className="text-xs mt-1 text-center">Input 0</div>
            </div>
          </>
        )}
        
        {showFlipFlopLibrary && (
          <>
            <div 
              className="p-2 bg-white border border-border rounded shadow-sm cursor-grab flex flex-col items-center"
              draggable
              onDragStart={() => onStartDrag('flipflop', 'JK')}
            >
              <div className="h-10 flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 80 80">
                  <rect x="10" y="10" width="60" height="60" fill="white" stroke="black" strokeWidth="2" />
                  <text x="40" y="45" fontSize="16" fontWeight="bold" textAnchor="middle">JK</text>
                </svg>
              </div>
              <div className="text-xs mt-1 text-center">JK Flip-Flop</div>
            </div>
            
            <div 
              className="p-2 bg-white border border-border rounded shadow-sm cursor-grab flex flex-col items-center"
              draggable
              onDragStart={() => onStartDrag('flipflop', 'D')}
            >
              <div className="h-10 flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 80 80">
                  <rect x="10" y="10" width="60" height="60" fill="white" stroke="black" strokeWidth="2" />
                  <text x="40" y="45" fontSize="16" fontWeight="bold" textAnchor="middle">D</text>
                </svg>
              </div>
              <div className="text-xs mt-1 text-center">D Flip-Flop</div>
            </div>
            
            <div 
              className="p-2 bg-white border border-border rounded shadow-sm cursor-grab flex flex-col items-center"
              draggable
              onDragStart={() => onStartDrag('input', 'CLOCK')}
            >
              <div className="h-10 flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 40 40">
                  <path d="M10,20 L15,20 L15,10 L25,10 L25,30 L35,30" fill="none" stroke="#888" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-xs mt-1 text-center">Clock</div>
            </div>
            
            <div 
              className="p-2 bg-white border border-border rounded shadow-sm cursor-grab flex flex-col items-center"
              draggable
              onDragStart={() => onStartDrag('output', 'LED')}
            >
              <div className="h-10 flex items-center justify-center">
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f8f8f8', border: '2px solid black' }}></div>
              </div>
              <div className="text-xs mt-1 text-center">LED</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComponentLibrary; 