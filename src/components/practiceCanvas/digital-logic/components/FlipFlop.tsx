import React from 'react';
import { ChevronsRight } from 'lucide-react';
import { LogicComponent } from '../types';

interface FlipFlopProps {
  component: LogicComponent;
  isSelected: boolean;
  onPortClick: (portId: string, portType: 'input' | 'output', e: React.MouseEvent) => void;
  onResize: (id: string, change: { width?: number, height?: number }) => void;
}

const FlipFlop: React.FC<FlipFlopProps> = ({
  component,
  isSelected,
  onPortClick,
  onResize
}) => {
  const { subtype, width, height } = component;
  
  return (
    <div className="relative">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect 
          x={width * 0.125} 
          y={height * 0.125} 
          width={width * 0.75} 
          height={height * 0.75} 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
        />
        
        {/* Clock input */}
        <line 
          x1={0} 
          y1={height * 0.75} 
          x2={width * 0.125} 
          y2={height * 0.75} 
          stroke="black" 
          strokeWidth="2" 
        />
        <path 
          d={`M${width * 0.125},${height * 0.69} L${width * 0.25},${height * 0.75} L${width * 0.125},${height * 0.81}`} 
          fill="none" 
          stroke="black" 
          strokeWidth="2"
        />
        
        {/* Inputs and outputs depending on flip-flop type */}
        {subtype === 'JK' && (
          <>
            <text x={width/2} y={height/2} fontSize={width * 0.225} fontWeight="bold" textAnchor="middle">JK</text>
            
            {/* J input */}
            <circle 
              cx={width * 0.06} 
              cy={height * 0.31} 
              r={3} 
              fill="gray"
              className="cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                // Assuming the first input is J
                onPortClick(component.inputs[0].id, 'input', e);
              }}
            />
            <line 
              x1={0} 
              y1={height * 0.31} 
              x2={width * 0.125} 
              y2={height * 0.31} 
              stroke="black" 
              strokeWidth="2" 
            />
            <text x={width * 0.25} y={height * 0.31} fontSize={width * 0.15} textAnchor="middle">J</text>
            
            {/* K input */}
            <circle 
              cx={width * 0.06} 
              cy={height * 0.94} 
              r={3} 
              fill="gray"
              className="cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                // Assuming the second input is K
                onPortClick(component.inputs[1].id, 'input', e);
              }}
            />
            <line 
              x1={0} 
              y1={height * 0.94} 
              x2={width * 0.125} 
              y2={height * 0.94} 
              stroke="black" 
              strokeWidth="2" 
            />
            <text x={width * 0.25} y={height * 0.94} fontSize={width * 0.15} textAnchor="middle">K</text>
            
            {/* Q output */}
            <circle 
              cx={width * 0.94} 
              cy={height * 0.31} 
              r={3} 
              fill={component.state ? "#4CAF50" : "gray"} 
              className="cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                // Assuming the first output is Q
                onPortClick(component.outputs[0].id, 'output', e);
              }}
            />
            <line 
              x1={width * 0.875} 
              y1={height * 0.31} 
              x2={width} 
              y2={height * 0.31} 
              stroke="black" 
              strokeWidth="2" 
            />
            <text x={width * 0.75} y={height * 0.31} fontSize={width * 0.15} textAnchor="middle">Q</text>
            
            {/* Q̅ output */}
            <circle 
              cx={width * 0.94} 
              cy={height * 0.94} 
              r={3} 
              fill={!component.state ? "#4CAF50" : "gray"} 
              className="cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                // Assuming the second output is Q̅
                onPortClick(component.outputs[1].id, 'output', e);
              }}
            />
            <line 
              x1={width * 0.875} 
              y1={height * 0.94} 
              x2={width} 
              y2={height * 0.94} 
              stroke="black" 
              strokeWidth="2" 
            />
            <text x={width * 0.75} y={height * 0.94} fontSize={width * 0.15} textAnchor="middle">Q̅</text>
          </>
        )}
        
        {subtype === 'D' && (
          <>
            <text x={width/2} y={height/2} fontSize={width * 0.225} fontWeight="bold" textAnchor="middle">D</text>
            
            {/* D input */}
            <circle 
              cx={width * 0.06} 
              cy={height * 0.5} 
              r={3} 
              fill="gray"
              className="cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                // Assuming the first input is D
                onPortClick(component.inputs[0].id, 'input', e);
              }}
            />
            <line 
              x1={0} 
              y1={height * 0.5} 
              x2={width * 0.125} 
              y2={height * 0.5} 
              stroke="black" 
              strokeWidth="2" 
            />
            <text x={width * 0.25} y={height * 0.5} fontSize={width * 0.15} textAnchor="middle">D</text>
            
            {/* Q output */}
            <circle 
              cx={width * 0.94} 
              cy={height * 0.31} 
              r={3} 
              fill={component.state ? "#4CAF50" : "gray"} 
              className="cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                // Assuming the first output is Q
                onPortClick(component.outputs[0].id, 'output', e);
              }}
            />
            <line 
              x1={width * 0.875} 
              y1={height * 0.31} 
              x2={width} 
              y2={height * 0.31} 
              stroke="black" 
              strokeWidth="2" 
            />
            <text x={width * 0.75} y={height * 0.31} fontSize={width * 0.15} textAnchor="middle">Q</text>
            
            {/* Q̅ output */}
            <circle 
              cx={width * 0.94} 
              cy={height * 0.94} 
              r={3} 
              fill={!component.state ? "#4CAF50" : "gray"} 
              className="cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                // Assuming the second output is Q̅
                onPortClick(component.outputs[1].id, 'output', e);
              }}
            />
            <line 
              x1={width * 0.875} 
              y1={height * 0.94} 
              x2={width} 
              y2={height * 0.94} 
              stroke="black" 
              strokeWidth="2" 
            />
            <text x={width * 0.75} y={height * 0.94} fontSize={width * 0.15} textAnchor="middle">Q̅</text>
          </>
        )}
      </svg>
      
      {isSelected && (
        <div className="absolute -right-6 top-0 flex flex-col gap-1">
          <button 
            className="p-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onResize(component.id, { width: 10, height: 10 });
            }}
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FlipFlop; 