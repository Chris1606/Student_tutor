import React, { useState } from 'react';
import { Zap, Edit2 } from 'lucide-react';
import { LogicComponent } from '../types';

interface InputOutputProps {
  component: LogicComponent;
  isSelected: boolean;
  onPortClick: (portId: string, portType: 'input' | 'output', e: React.MouseEvent) => void;
  onToggleState: (id: string) => void;
  onEditName?: (newName: string) => void;
}

const InputOutput: React.FC<InputOutputProps> = ({
  component,
  isSelected,
  onPortClick,
  onToggleState,
  onEditName
}) => {
  const { subtype, width, height, name } = component;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name || '');
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(name || '');
    setIsEditing(true);
  };
  
  const handleInputBlur = () => {
    setIsEditing(false);
    if (onEditName && editValue.trim()) {
      onEditName(editValue.trim());
    }
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (onEditName && editValue.trim()) {
        onEditName(editValue.trim());
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };
  
  // Xử lý hiển thị biến input
  if (subtype === 'VARIABLE') {
    return (
      <div className="relative">
        <div 
          style={{ 
            width, 
            height, 
            borderRadius: '8px',
            background: '#f5f5f5',
            border: '2px solid #666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              autoFocus
              className="w-full h-full text-center bg-white border-none outline-none"
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: '11px' }}
            />
          ) : (
            <div className="text-xs font-medium text-center overflow-hidden text-ellipsis px-1">
              {name || 'var'}
            </div>
          )}
          
          {/* Output port */}
          {component.outputs.map((output, index) => (
            <div 
              key={`output-${output.id}`} 
              className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"
            >
              <div 
                className="w-3 h-3 rounded-full bg-gray-400 cursor-pointer hover:bg-tutu-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onPortClick(output.id, 'output', e);
                }}
              />
            </div>
          ))}
        </div>
        
        {isSelected && (
          <div className="absolute top-0 right-0 transform translate-x-full -translate-y-1/2 flex">
            <button 
              className="p-1 mr-1 bg-tutu-50 text-tutu-600 rounded hover:bg-tutu-100"
              onClick={handleEditClick}
              title="Đổi tên biến"
            >
              <Edit2 size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }
  
  if (subtype === 'HIGH' || subtype === 'LOW') {
    return (
      <div className="relative">
        <div 
          style={{ 
            width, 
            height, 
            borderRadius: '50%',
            background: component.state ? '#4CAF50' : '#f44336',
            border: '2px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            position: 'relative'
          }}
        >
          {component.state ? '1' : '0'}
          
          {/* Output port */}
          {component.outputs.map((output, index) => (
            <div 
              key={`output-${output.id}`} 
              className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"
            >
              <div 
                className="w-3 h-3 rounded-full bg-gray-400 cursor-pointer hover:bg-tutu-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onPortClick(output.id, 'output', e);
                }}
              />
            </div>
          ))}
        </div>
        
        {isSelected && (
          <div className="absolute top-0 right-0 transform translate-x-full -translate-y-1/2">
            <button 
              className="p-1 bg-tutu-50 text-tutu-600 rounded hover:bg-tutu-100"
              onClick={(e) => {
                e.stopPropagation();
                onToggleState(component.id);
              }}
            >
              <Zap size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }
  
  if (subtype === 'CLOCK') {
    return (
      <div className="relative">
        <div 
          style={{ 
            width, 
            height, 
            background: 'white',
            border: '2px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <svg width={width} height={height} viewBox="0 0 40 40">
            <path 
              d="M10,20 L15,20 L15,10 L25,10 L25,30 L35,30" 
              fill="none" 
              stroke={component.state ? '#4CAF50' : '#f44336'} 
              strokeWidth="2"
            />
          </svg>
          
          {/* Output port */}
          {component.outputs.map((output, index) => (
            <div 
              key={`output-${output.id}`} 
              className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"
            >
              <div 
                className="w-3 h-3 rounded-full bg-gray-400 cursor-pointer hover:bg-tutu-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onPortClick(output.id, 'output', e);
                }}
              />
            </div>
          ))}
        </div>
        
        {isSelected && (
          <div className="absolute top-0 right-0 transform translate-x-full -translate-y-1/2">
            <button 
              className="p-1 bg-tutu-50 text-tutu-600 rounded hover:bg-tutu-100"
              onClick={(e) => {
                e.stopPropagation();
                onToggleState(component.id);
              }}
            >
              <Zap size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }
  
  if (subtype === 'LED') {
    return (
      <div className="relative">
        <div 
          style={{ 
            width, 
            height, 
            borderRadius: '50%',
            background: component.state ? '#4CAF50' : '#f8f8f8',
            boxShadow: component.state ? '0 0 15px #4CAF50' : 'none',
            border: '2px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          LED
          
          {/* Input port */}
          {component.inputs.map((input, index) => (
            <div 
              key={`input-${input.id}`} 
              className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div 
                className="w-3 h-3 rounded-full bg-gray-400 cursor-pointer hover:bg-tutu-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onPortClick(input.id, 'input', e);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return null;
};

export default InputOutput; 