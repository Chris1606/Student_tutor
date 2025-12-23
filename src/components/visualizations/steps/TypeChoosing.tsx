import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TypeChoosingProps {
  onTypeSelect: (type: string) => void;
  selectedLevel: string;
}

export const TypeChoosing: React.FC<TypeChoosingProps> = ({ onTypeSelect, selectedLevel }) => {
  const navigate = useNavigate();

  const handleTypeSelect = (type: string) => {
    onTypeSelect(type);
    
    // If Function minimization and Hard level are selected, navigate to K-map exercise
    if (type === 'Function minimization' && selectedLevel === 'Hard') {
      navigate('/kmap-exercise');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Choose Exercise Type</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          className="p-6 text-left border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => handleTypeSelect('Function minimization')}
        >
          <h4 className="font-medium mb-2">Function minimization</h4>
          <p className="text-sm text-muted-foreground">
            Simplify boolean functions using K-map method
          </p>
        </button>

        <button
          className="p-6 text-left border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => handleTypeSelect('Truth table')}
        >
          <h4 className="font-medium mb-2">Truth table</h4>
          <p className="text-sm text-muted-foreground">
            Create and analyze truth tables for boolean expressions
          </p>
        </button>
      </div>
    </div>
  );
}; 