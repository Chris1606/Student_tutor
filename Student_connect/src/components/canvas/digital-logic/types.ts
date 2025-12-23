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

// Định nghĩa các kiểu cho DAG (Directed Acyclic Graph)
export interface DAGNode {
  id: string;
  type: 'gate' | 'flipflop' | 'input' | 'output';
  subtype: LogicGateType | FlipFlopType | InputOutputType;
  label: string; // Tên hiển thị của node
  data?: {
    state?: boolean;
    name?: string;
    position?: { x: number, y: number };
  };
}

export interface DAGEdge {
  id: string;
  source: string; // Node ID nguồn
  target: string; // Node ID đích
  sourceHandle?: string; // Port ID nguồn
  targetHandle?: string; // Port ID đích
}

export interface CircuitDAG {
  nodes: DAGNode[];
  edges: DAGEdge[];
} 