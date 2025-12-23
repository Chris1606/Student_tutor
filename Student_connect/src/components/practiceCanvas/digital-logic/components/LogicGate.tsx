import React from 'react';
import { PlusCircle, Trash2, ChevronsRight } from 'lucide-react';
import { LogicComponent } from '../types';

interface LogicGateProps {
  component: LogicComponent;
  isSelected: boolean;
  onPortClick: (portId: string, portType: 'input' | 'output', e: React.MouseEvent) => void;
  onAddInput: (id: string) => void;
  onRemoveInput: (id: string) => void;
  onResize: (id: string, change: { width?: number, height?: number }) => void;
}

const LogicGate: React.FC<LogicGateProps> = ({
  component,
  isSelected,
  onPortClick,
  onAddInput,
  onRemoveInput,
  onResize
}) => {
  const { subtype, width, height } = component;
  
  const renderGateContent = () => {
    switch (subtype) {
      case 'AND':
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <path 
              d={`M${width/6},${height/6} L${width/2},${height/6} Q${5*width/6},${height/2} ${width/2},${5*height/6} L${width/6},${5*height/6} Z`}
              fill="white" 
              stroke="black" 
              strokeWidth="2"
            />
            
            {/* Input ports */}
            {component.inputs.map((input, index) => {
              const y = height/6 + (index / (component.inputs.length - 1 || 1)) * (2*height/3);
              return (
                <g key={`input-${input.id}`}>
                  <circle 
                    cx={width/6} 
                    cy={y} 
                    r={3} 
                    fill="gray"
                    className="cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onPortClick(input.id, 'input', e);
                    }}
                  />
                  <text x={width/6 + 10} y={y + 4} fontSize="10" textAnchor="start">{input.name}</text>
                </g>
              );
            })}
            
            {/* Output port */}
            {component.outputs.map((output, index) => (
              <g key={`output-${output.id}`}>
                <circle 
                  cx={5*width/6} 
                  cy={height/2} 
                  r={3} 
                  fill="gray"
                  className="cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPortClick(output.id, 'output', e);
                  }}
                />
                <text x={5*width/6 - 10} y={height/2 + 4} fontSize="10" textAnchor="end">{output.name}</text>
              </g>
            ))}
            
            <text x={width/2} y={height/2 + 5} fontSize="12" textAnchor="middle">AND</text>
          </svg>
        );
      case 'OR':
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <path 
              d={`M${width/6},${height/6} Q${width/2},${height/6} ${5*width/6},${height/2} Q${width/2},${5*height/6} ${width/6},${5*height/6} Q${width/3},${height/2} ${width/6},${height/6} Z`}
              fill="white" 
              stroke="black" 
              strokeWidth="2"
            />
            
            {/* Input ports */}
            {component.inputs.map((input, index) => {
              const y = height/6 + (index / (component.inputs.length - 1 || 1)) * (2*height/3);
              return (
                <g key={`input-${input.id}`}>
                  <circle 
                    cx={width/6} 
                    cy={y} 
                    r={3} 
                    fill="gray"
                    className="cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onPortClick(input.id, 'input', e);
                    }}
                  />
                  <text x={width/6 + 10} y={y + 4} fontSize="10" textAnchor="start">{input.name}</text>
                </g>
              );
            })}
            
            {/* Output port */}
            {component.outputs.map((output, index) => (
              <g key={`output-${output.id}`}>
                <circle 
                  cx={5*width/6} 
                  cy={height/2} 
                  r={3} 
                  fill="gray"
                  className="cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPortClick(output.id, 'output', e);
                  }}
                />
                <text x={5*width/6 - 10} y={height/2 + 4} fontSize="10" textAnchor="end">{output.name}</text>
              </g>
            ))}
            
            <text x={width/2} y={height/2 + 5} fontSize="12" textAnchor="middle">OR</text>
          </svg>
        );
      case 'NOT':
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <path 
              d={`M${width/6},${height/6} L${2*width/3},${height/2} L${width/6},${5*height/6} Z`}
              fill="white" 
              stroke="black" 
              strokeWidth="2"
            />
            <circle 
              cx={5*width/6} 
              cy={height/2} 
              r={width/10} 
              stroke="black" 
              strokeWidth="2" 
              fill="white" 
            />
            
            {/* Input port */}
            {component.inputs.map((input, index) => (
              <g key={`input-${input.id}`}>
                <circle 
                  cx={width/6} 
                  cy={height/2} 
                  r={3} 
                  fill="gray"
                  className="cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPortClick(input.id, 'input', e);
                  }}
                />
                <text x={width/6 + 10} y={height/2 + 4} fontSize="10" textAnchor="start">{input.name}</text>
              </g>
            ))}
            
            {/* Output port */}
            {component.outputs.map((output, index) => (
              <g key={`output-${output.id}`}>
                <circle 
                  cx={5*width/6 + width/10} 
                  cy={height/2} 
                  r={3} 
                  fill="gray"
                  className="cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPortClick(output.id, 'output', e);
                  }}
                />
                <text x={5*width/6 - 5} y={height/2 + 4} fontSize="10" textAnchor="end">{output.name}</text>
              </g>
            ))}
            
            <text x={width/2} y={height/2 + 5} fontSize="12" textAnchor="middle">NOT</text>
          </svg>
        );
      default:
        return (
          <div 
            style={{ 
              width, 
              height, 
              background: 'white', 
              border: '2px solid black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {subtype}
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {renderGateContent()}
      
      {isSelected && (
        <div className="absolute -right-6 top-0 flex flex-col gap-1">
          {subtype !== 'NOT' && (
            <button 
              className="p-1 bg-tutu-50 text-tutu-600 rounded hover:bg-tutu-100 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onAddInput(component.id);
              }}
            >
              <PlusCircle size={14} />
            </button>
          )}
          
          {component.inputs.length > 1 && (
            <button 
              className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveInput(component.id);
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
          
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

export default LogicGate; 