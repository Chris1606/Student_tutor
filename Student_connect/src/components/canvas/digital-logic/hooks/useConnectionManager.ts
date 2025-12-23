import { useState, useRef } from 'react';
import { Connection, ConnectionStartInfo, LogicComponent, Port } from '../types';
import { generateId, calculateInputPortPosition, calculateOutputPortPosition, findPortById } from '../utils';

export const useConnectionManager = (components: LogicComponent[]) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionStartInfo, setConnectionStartInfo] = useState<ConnectionStartInfo | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Cập nhật vị trí chuột (đã được chuyển đổi sang không gian logic)
  const updateMousePosition = (x: number, y: number) => {
    setMousePosition({ x, y });
  };

  // Xử lý khi click vào port
  const handlePortClick = (portId: string, portType: 'input' | 'output', componentId: string) => {
    if (!connectionStartInfo) {
      // Bắt đầu kết nối
      setConnectionStartInfo({ 
        componentId, 
        portId, 
        portType 
      });
    } else {
      // Kết thúc kết nối
      const startComponent = components.find(c => c.id === connectionStartInfo.componentId);
      const endComponent = components.find(c => c.id === componentId);
      
      if (!startComponent || !endComponent) {
        setConnectionStartInfo(null);
        return;
      }
      
      // Tìm index của port trong danh sách inputs/outputs
      const startPorts = connectionStartInfo.portType === 'input' ? startComponent.inputs : startComponent.outputs;
      const startPortIndex = startPorts.findIndex(p => p.id === connectionStartInfo.portId);
      
      const endPorts = portType === 'input' ? endComponent.inputs : endComponent.outputs;
      const endPortIndex = endPorts.findIndex(p => p.id === portId);
      
      if (startPortIndex === -1 || endPortIndex === -1) {
        setConnectionStartInfo(null);
        return;
      }
      
      // Tính toán vị trí port - những tọa độ này đã được tính trong không gian thu/phóng
      const startPort = {
        componentId: connectionStartInfo.componentId,
        portId: connectionStartInfo.portId,
        type: connectionStartInfo.portType,
        x: connectionStartInfo.portType === 'input' 
          ? calculateInputPortPosition(startComponent, startPortIndex).x
          : calculateOutputPortPosition(startComponent, startPortIndex).x,
        y: connectionStartInfo.portType === 'input' 
          ? calculateInputPortPosition(startComponent, startPortIndex).y
          : calculateOutputPortPosition(startComponent, startPortIndex).y
      };
      
      const endPort = {
        componentId,
        portId,
        type: portType,
        x: portType === 'input' 
          ? calculateInputPortPosition(endComponent, endPortIndex).x
          : calculateOutputPortPosition(endComponent, endPortIndex).x,
        y: portType === 'input' 
          ? calculateInputPortPosition(endComponent, endPortIndex).y
          : calculateOutputPortPosition(endComponent, endPortIndex).y
      };
      
      if (startPort && endPort) {
        // Nếu cả hai cổng đều là đầu vào hoặc đầu ra thì không kết nối được
        if (startPort.type === endPort.type) {
          console.log('Không thể kết nối hai cổng cùng loại!');
          setConnectionStartInfo(null);
          return;
        }
        
        // Đảm bảo fromPort luôn là output và toPort luôn là input
        const fromPort = startPort.type === 'output' ? startPort : endPort;
        const toPort = startPort.type === 'output' ? endPort : startPort;
        
        // Kiểm tra xem kết nối này đã tồn tại chưa
        const connectionExists = connections.some(conn => 
          (conn.fromPort.componentId === fromPort.componentId && 
           conn.fromPort.portId === fromPort.portId && 
           conn.toPort.componentId === toPort.componentId && 
           conn.toPort.portId === toPort.portId)
        );
        
        if (connectionExists) {
          console.log('Kết nối này đã tồn tại!');
          setConnectionStartInfo(null);
          return;
        }
        
        // Kiểm tra đầu vào này đã có kết nối nào đến chưa
        const inputHasConnection = connections.some(conn => 
          conn.toPort.componentId === toPort.componentId && 
          conn.toPort.portId === toPort.portId
        );
        
        if (inputHasConnection) {
          console.log('Đầu vào này đã có kết nối!');
          setConnectionStartInfo(null);
          return;
        }
        
        // Tạo kết nối mới
        const newConnection: Connection = {
          id: generateId(),
          fromPort,
          toPort,
          points: []
        };
        
        // Thêm kết nối vào danh sách
        setConnections(prev => [...prev, newConnection]);
      }
      
      setConnectionStartInfo(null);
    }
  };

  // Cập nhật kết nối khi di chuyển component
  const updateConnectionsAfterMove = (componentId: string) => {
    setConnections(prev => {
      return prev.map(conn => {
        const needsUpdate = conn.fromPort.componentId === componentId || conn.toPort.componentId === componentId;
        
        if (!needsUpdate) return conn;
        
        const fromPort = conn.fromPort.componentId === componentId 
          ? findPortById(components, componentId, conn.fromPort.portId, 'output')
          : conn.fromPort;
          
        const toPort = conn.toPort.componentId === componentId
          ? findPortById(components, componentId, conn.toPort.portId, 'input')
          : conn.toPort;
        
        return {
          ...conn,
          fromPort: fromPort || conn.fromPort,
          toPort: toPort || conn.toPort
        };
      });
    });
  };

  // Cập nhật kết nối khi components thay đổi
  const updateConnectionsForChangedComponents = () => {
    if (connections.length > 0) {
      const updatedConnections = connections.map(conn => {
        const fromComponent = components.find(c => c.id === conn.fromPort.componentId);
        const toComponent = components.find(c => c.id === conn.toPort.componentId);
        
        if (!fromComponent || !toComponent) return conn;
        
        // Tìm index của port
        const fromPortIndex = fromComponent.outputs.findIndex(p => p.id === conn.fromPort.portId);
        const toPortIndex = toComponent.inputs.findIndex(p => p.id === conn.toPort.portId);
        
        if (fromPortIndex === -1 || toPortIndex === -1) return conn;
        
        // Tính toán vị trí port mới
        const fromPortPos = calculateOutputPortPosition(fromComponent, fromPortIndex);
        const toPortPos = calculateInputPortPosition(toComponent, toPortIndex);
        
        // Chỉ cập nhật nếu vị trí đã thay đổi
        if (
          Math.abs(conn.fromPort.x - fromPortPos.x) < 0.1 && 
          Math.abs(conn.fromPort.y - fromPortPos.y) < 0.1 &&
          Math.abs(conn.toPort.x - toPortPos.x) < 0.1 && 
          Math.abs(conn.toPort.y - toPortPos.y) < 0.1
        ) {
          return conn;
        }
        
        return {
          ...conn,
          fromPort: { ...conn.fromPort, x: fromPortPos.x, y: fromPortPos.y },
          toPort: { ...conn.toPort, x: toPortPos.x, y: toPortPos.y }
        };
      });
      
      // Chỉ cập nhật nếu có sự thay đổi
      const needsUpdate = updatedConnections.some((conn, index) => {
        const oldConn = connections[index];
        return (
          oldConn.fromPort.x !== conn.fromPort.x ||
          oldConn.fromPort.y !== conn.fromPort.y ||
          oldConn.toPort.x !== conn.toPort.x ||
          oldConn.toPort.y !== conn.toPort.y
        );
      });
      
      if (needsUpdate) {
        setConnections(updatedConnections);
      }
    }
  };

  // Xóa kết nối
  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));
    if (selectedConnection === id) {
      setSelectedConnection(null);
    }
  };

  // Xóa tất cả kết nối liên quan đến component
  const deleteConnectionsForComponent = (componentId: string) => {
    return connections.filter(conn => 
      conn.fromPort.componentId !== componentId && conn.toPort.componentId !== componentId
    );
  };

  return {
    connections,
    setConnections,
    connectionStartInfo,
    setConnectionStartInfo,
    selectedConnection,
    setSelectedConnection,
    mousePosition,
    updateMousePosition,
    handlePortClick,
    updateConnectionsAfterMove,
    updateConnectionsForChangedComponents,
    deleteConnection,
    deleteConnectionsForComponent
  };
}; 