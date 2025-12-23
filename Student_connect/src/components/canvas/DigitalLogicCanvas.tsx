import React from 'react';
import DigitalLogicCanvas from './digital-logic/DigitalLogicCanvas';
import { CircuitDAG } from './digital-logic/types';

interface DigitalLogicCanvasWrapperProps {
  onSubmit?: (isValid: boolean, data?: CircuitDAG) => void;
  type?: string;
}

const DigitalLogicCanvasWrapper: React.FC<DigitalLogicCanvasWrapperProps> = ({ 
  onSubmit,
  type = 'counter'
}) => {
  return <DigitalLogicCanvas onSubmit={onSubmit} type={type} />;
};

export default DigitalLogicCanvasWrapper; 