import React, { useState, useEffect } from 'react';
import { InteractiveKarnaughMap } from '@/components/visualizations/InteractiveKarnaughMap';
import { useToast } from '@/hooks/use-toast';

interface KmapCanvasProps {
  variables?: number;
  minterms?: number[];
  dontCares?: number[];
  onComplete?: (expression: string) => void;
}

const KmapCanvas: React.FC<KmapCanvasProps> = ({
  variables = 4,
  minterms = [],
  dontCares = [],
  onComplete
}) => {
  const { toast } = useToast();
  const [booleanFunction, setBooleanFunction] = useState<string>('');

  useEffect(() => {
    // Convert minterms and dontcares to boolean function string
    if (minterms.length > 0) {
      const mintermStr = `m(${minterms.join(',')})`;
      const dontCareStr = dontCares.length > 0 ? `+Σd(${dontCares.join(',')})` : '';
      setBooleanFunction(`f(a,b,c,d)=Σ${mintermStr}${dontCareStr}`);
    }
  }, [minterms, dontCares]);

  const handleComplete = (expression: string) => {
    if (onComplete) {
      onComplete(expression);
    }
    toast({
      title: "Solution Complete",
      description: `Minimized expression: ${expression}`,
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <InteractiveKarnaughMap
          booleanFunction={booleanFunction}
          minterms={minterms}
          dontCares={dontCares}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default KmapCanvas;