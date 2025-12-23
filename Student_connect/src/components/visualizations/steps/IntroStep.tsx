import React from 'react';
import { MapSize } from '../utils/kmap-utils';

interface IntroStepProps {
  booleanFunction: string;
  userMinterms: number[];
  userDontCares: number[];
  mapSize: MapSize;
  setMapSize: (size: MapSize) => void;
  goToNextStep: () => void;
}

export const IntroStep: React.FC<IntroStepProps> = ({
  booleanFunction,
  userMinterms,
  userDontCares,
  mapSize,
  setMapSize,
  goToNextStep
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Welcome to the K-Map Exercise!</h3>
        <p className="text-sm text-muted-foreground">
          Let's solve this boolean function using a Karnaugh map:
        </p>
        <div className="p-4 bg-muted rounded-lg">
          <code className="text-sm">{booleanFunction}</code>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Function Details:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Minterms: {userMinterms.join(', ')}</li>
          <li>• Don't Cares: {userDontCares.join(', ')}</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Select K-Map Size:</h4>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-sm rounded-md border ${
              mapSize === '2x2'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={() => setMapSize('2x2')}
          >
            2x2
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md border ${
              mapSize === '2x4'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={() => setMapSize('2x4')}
          >
            2x4
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md border ${
              mapSize === '4x4'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={() => setMapSize('4x4')}
          >
            4x4
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Instructions:</h4>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Select the appropriate K-map size for your function</li>
          <li>Click "Start" to begin filling in the K-map</li>
          <li>Place 1s for minterms and Xs for don't cares</li>
          <li>Click cells to cycle through values (0 → 1 → X → 0)</li>
        </ol>
      </div>

      <div className="pt-4">
        <button
          className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
          onClick={goToNextStep}
        >
          Start
        </button>
      </div>
    </div>
  );
}; 