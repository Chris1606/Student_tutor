import { LogicComponent, Connection, Port, DAGNode, DAGEdge, CircuitDAG } from './types';

// Tạo ID ngẫu nhiên
export const generateId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Chuyển đổi tọa độ từ không gian canvas sang không gian logic
export const canvasToLogicPosition = (
  clientX: number, 
  clientY: number, 
  canvasRect: DOMRect, 
  position: { x: number, y: number }, 
  scale: number
): { x: number, y: number } => {
  // Tính toán vị trí tương đối trong canvas
  const mouseX = clientX - canvasRect.left;
  const mouseY = clientY - canvasRect.top;
  
  // Chuyển đổi sang tọa độ logic dựa trên vị trí và tỉ lệ
  return {
    x: (mouseX - position.x) / scale,
    y: (mouseY - position.y) / scale
  };
};

// Chuyển đổi tọa độ từ không gian logic sang không gian canvas
export const logicToCanvasPosition = (
  x: number, 
  y: number, 
  position: { x: number, y: number }, 
  scale: number,
  canvasRect: DOMRect
): { x: number, y: number } => {
  // Áp dụng tỉ lệ và vị trí
  const canvasX = x * scale + position.x;
  const canvasY = y * scale + position.y;
  
  // Tính toán vị trí tuyệt đối trên trình duyệt
  return {
    x: canvasRect.left + canvasX,
    y: canvasRect.top + canvasY
  };
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

// Chuyển đổi mạch thành đồ thị có hướng (DAG)
export const convertCircuitToDAG = (components: LogicComponent[], connections: Connection[]): CircuitDAG => {
  // Tạo danh sách các node từ components
  const nodes: DAGNode[] = components.map(component => {
    // Tạo label hiển thị cho node
    let label = '';
    
    if (component.type === 'gate') {
      label = component.subtype; // AND, OR, NOT, ...
    } else if (component.type === 'flipflop') {
      label = `${component.subtype} Flip-Flop`; // D Flip-Flop, JK Flip-Flop,...
    } else if (component.type === 'input') {
      if (component.subtype === 'VARIABLE') {
        label = component.name || 'Variable';
      } else if (component.subtype === 'HIGH') {
        label = 'HIGH';
      } else if (component.subtype === 'LOW') {
        label = 'LOW';
      } else if (component.subtype === 'CLOCK') {
        label = 'Clock';
      }
    } else if (component.type === 'output') {
      if (component.subtype === 'LED') {
        label = 'LED';
      } else {
        label = component.name || 'Output';
      }
    }
    
    return {
      id: component.id,
      type: component.type,
      subtype: component.subtype,
      label,
      data: {
        state: component.state,
        name: component.name,
        position: { x: component.x, y: component.y }
      }
    };
  });
  
  // Tạo danh sách các cạnh từ connections
  const edges: DAGEdge[] = connections.map(connection => {
    return {
      id: connection.id,
      source: connection.fromPort.componentId,
      target: connection.toPort.componentId,
      sourceHandle: connection.fromPort.portId,
      targetHandle: connection.toPort.portId
    };
  });
  
  return { nodes, edges };
};

// Kiểm tra xem đồ thị có chu trình hay không
export const hasCycle = (dag: CircuitDAG): boolean => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  // Map lưu trữ các cạnh ra từ mỗi node
  const adjacencyList = new Map<string, string[]>();
  
  // Xây dựng adjacency list
  dag.nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });
  
  dag.edges.forEach(edge => {
    const adjNodes = adjacencyList.get(edge.source) || [];
    adjNodes.push(edge.target);
    adjacencyList.set(edge.source, adjNodes);
  });
  
  // Hàm DFS để phát hiện chu trình
  const hasCycleUtil = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) {
      return true;
    }
    
    if (visited.has(nodeId)) {
      return false;
    }
    
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const neighbors = adjacencyList.get(nodeId) || [];
    for (let i = 0; i < neighbors.length; i++) {
      if (hasCycleUtil(neighbors[i])) {
        return true;
      }
    }
    
    recursionStack.delete(nodeId);
    return false;
  };
  
  // Gọi DFS cho tất cả các nodes chưa được thăm
  for (const node of dag.nodes) {
    if (!visited.has(node.id)) {
      if (hasCycleUtil(node.id)) {
        return true;
      }
    }
  }
  
  return false;
}; 