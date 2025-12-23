// Định nghĩa các cổng logic
export type LogicGateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
export type FlipFlopType = 'D' | 'JK' | 'SR' | 'T';
export type InputOutputType = 'HIGH' | 'LOW' | 'CLOCK' | 'LED' | 'VARIABLE';

export interface LogicComponent {
  id: string;
  type: 'gate' | 'flipflop' | 'input' | 'output';
  subtype: LogicGateType | FlipFlopType | InputOutputType;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: {id: string, name: string}[];
  outputs: {id: string, name: string}[];
  state?: boolean;
  name?: string; // Tên biến cho input/output
}

export interface Port {
  componentId: string;
  portId: string;
  type: 'input' | 'output';
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  fromPort: Port;
  toPort: Port;
  points: { x: number; y: number }[];
}

export interface ConnectionStartInfo {
  componentId: string; 
  portId: string;
  portType: 'input' | 'output';
} 