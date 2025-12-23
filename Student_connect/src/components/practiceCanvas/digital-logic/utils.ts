import { LogicComponent, Connection, Port } from './types';

// Tạo ID ngẫu nhiên
export const generateId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Tính toán vị trí cổng input dựa trên component và index
export const calculateInputPortPosition = (component: LogicComponent, inputIndex: number): { x: number, y: number } => {
  const { x, y, width, height, type, subtype } = component;
  
  if (type === 'gate') {
    if (subtype === 'NOT') {
      return { x: x - width / 3, y };
    } else {
      const inputCount = component.inputs.length;
      const inputSpacing = height * 0.7 / Math.max(inputCount - 1, 1);
      const startY = y - height * 0.35;
      return { 
        x: x - width / 2, 
        y: startY + inputIndex * inputSpacing 
      };
    }
  } else if (type === 'flipflop') {
    if (subtype === 'JK') {
      if (inputIndex === 0) {
        return { x: x - width / 2, y: y - height * 0.25 }; // J input
      } else if (inputIndex === 1) {
        return { x: x - width / 2, y: y + height * 0.25 }; // K input
      } else {
        return { x: x - width / 2, y: y }; // Clock input
      }
    } else if (subtype === 'D') {
      if (inputIndex === 0) {
        return { x: x - width / 2, y: y - height * 0.2 }; // D input
      } else {
        return { x: x - width / 2, y: y + height * 0.2 }; // Clock input
      }
    }
  } else if (type === 'output') {
    return { x: x - width / 2, y };
  }
  
  return { x: x - width / 2, y };
};

// Tính toán vị trí cổng output dựa trên component và index
export const calculateOutputPortPosition = (component: LogicComponent, outputIndex: number): { x: number, y: number } => {
  const { x, y, width, height, type, subtype } = component;
  
  if (type === 'gate') {
    if (subtype === 'NOT') {
      return { x: x + width / 2 + width / 10, y };
    } else {
      return { x: x + width / 2, y };
    }
  } else if (type === 'flipflop') {
    if (outputIndex === 0) {
      return { x: x + width / 2, y: y - height * 0.25 }; // Q output
    } else {
      return { x: x + width / 2, y: y + height * 0.25 }; // Q̅ output
    }
  } else if (type === 'input') {
    return { x: x + width / 2, y };
  }
  
  return { x: x + width / 2, y };
};

// Tìm port dựa trên ID
export const findPortById = (components: LogicComponent[], componentId: string, portId: string, portType: 'input' | 'output'): Port | null => {
  const component = components.find(c => c.id === componentId);
  if (!component) return null;
  
  const ports = portType === 'input' ? component.inputs : component.outputs;
  const portIndex = ports.findIndex(p => p.id === portId);
  if (portIndex === -1) return null;
  
  const portPosition = portType === 'input' 
    ? calculateInputPortPosition(component, portIndex)
    : calculateOutputPortPosition(component, portIndex);
  
  return {
    componentId,
    portId,
    type: portType,
    x: portPosition.x,
    y: portPosition.y
  };
};

// Kiểm tra xem kết nối này có hợp lệ không
export const isValidConnection = (fromPort: Port, toPort: Port, connections: Connection[]): boolean => {
  // Không thể kết nối từ input đến input hoặc output đến output
  if (fromPort.type === toPort.type) {
    return false;
  }
  
  // Đảm bảo fromPort luôn là output và toPort luôn là input
  if (fromPort.type !== 'output') {
    const temp = fromPort;
    fromPort = toPort;
    toPort = temp;
  }
  
  // Không thể kết nối 2 cổng đã kết nối rồi
  const connectionExists = connections.some(conn => 
    (conn.fromPort.portId === fromPort.portId && conn.fromPort.componentId === fromPort.componentId &&
     conn.toPort.portId === toPort.portId && conn.toPort.componentId === toPort.componentId) ||
    (conn.fromPort.portId === toPort.portId && conn.fromPort.componentId === toPort.componentId &&
     conn.toPort.portId === fromPort.portId && conn.toPort.componentId === fromPort.componentId)
  );
  
  // Không nên có nhiều đầu ra vào cùng một đầu vào
  const inputHasConnection = connections.some(conn => 
    conn.toPort.portId === toPort.portId && conn.toPort.componentId === toPort.componentId
  );
  
  return !connectionExists && !inputHasConnection;
}; 