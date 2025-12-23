import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from './hooks/useHistory';
import { useComponentManager } from './hooks/useComponentManager';
import { useConnectionManager } from './hooks/useConnectionManager';
import { useContextMenu } from './hooks/useContextMenu';
import { CircuitValidator } from '@/services/circuitValidator';
import { Button } from '@/components/ui/button';
import { Send, ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import Toolbar from './components/Toolbar';
import ComponentLibrary from './components/ComponentLibrary';
import HoverMenu from './components/HoverMenu';
import Connection from './components/Connection';
import LogicGate from './components/LogicGate';
import FlipFlop from './components/FlipFlop';
import InputOutput from './components/InputOutput';

import { generateId, canvasToLogicPosition, logicToCanvasPosition, convertCircuitToDAG, hasCycle } from './utils';
import { CircuitDAG } from './types';

interface DigitalLogicCanvasProps {
  type?: string; // Loại mạch cần vẽ (ví dụ: 'counter', 'decoder', etc.)
  onSubmit?: (isValid: boolean, data?: CircuitDAG) => void;
}

const DigitalLogicCanvas: React.FC<DigitalLogicCanvasProps> = ({ 
  type = 'counter',
  onSubmit 
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showComponentLibrary, setShowComponentLibrary] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Thêm các state cho việc phóng to/thu nhỏ và di chuyển canvas
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  // Không giới hạn kích thước canvas
  
  // Sử dụng các hook đã tách
  const {
    components,
    setComponents,
    selectedComponent,
    setSelectedComponent,
    isDragging,
    draggedComponent,
    setDraggedComponent,
    createComponent,
    deleteComponent,
    duplicateComponent,
    addInputToComponent,
    removeInputFromComponent,
    resizeComponent,
    toggleComponentState,
    editVariableName,
    startDrag,
    startDragComponent,
    updateDraggedComponent,
    stopDragging,
    handleComponentClick
  } = useComponentManager();
  
  const {
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
  } = useConnectionManager(components);
  
  const {
    menuVisible,
    setMenuVisible,
    hoveredComponent,
    setHoveredComponent,
    handleComponentMouseEnter,
    handleComponentMouseLeave,
    handleMenuMouseEnter,
    handleMenuMouseLeave,
    clearMenuAndTimeout
  } = useContextMenu();
  
  const {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    shouldAddToHistory
  } = useHistory();
  
  // Lưu snapshot khi components hoặc connections thay đổi
  useEffect(() => {
    if (shouldAddToHistory(components, connections)) {
      addToHistory(components, connections);
    }
  }, [components, connections]);
  
  // Cập nhật kết nối khi components thay đổi
  useEffect(() => {
    updateConnectionsForChangedComponents();
  }, [components]);
  
  // Thêm xử lý phím tắt
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Z để undo
      if (e.altKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      // Alt + Y để redo
      else if (e.altKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Cập nhật hàm handleMouseMove để hỗ trợ di chuyển canvas
  const handleMouseMove = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const logicPos = canvasToLogicPosition(e.clientX, e.clientY, rect, position, scale);
      updateMousePosition(logicPos.x, logicPos.y);
    }
    
    // Xử lý di chuyển canvas (panning)
    if (isPanning) {
      const dx = e.clientX - startPanPosition.x;
      const dy = e.clientY - startPanPosition.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setStartPanPosition({ x: e.clientX, y: e.clientY });
    }
    // Xử lý kéo component
    else if (isDragging) {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const logicPos = canvasToLogicPosition(e.clientX, e.clientY, rect, position, scale);
        const componentId = updateDraggedComponent(logicPos.x, logicPos.y);
        if (componentId) {
          updateConnectionsAfterMove(componentId);
        }
      }
    }
  };
  
  // Hàm bắt đầu panning
  const startPanning = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Nếu là middle-click hoặc Alt+left-click
      e.preventDefault();
      e.stopPropagation();
      setIsPanning(true);
      setStartPanPosition({ x: e.clientX, y: e.clientY });
      
      // Thay đổi cursor để biểu thị đang pan
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grab';
      }
    }
  };
  
  // Hàm kết thúc panning
  const stopPanning = () => {
    setIsPanning(false);
    
    // Khôi phục cursor
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }
  };
  
  // Cập nhật hàm xử lý phóng to/thu nhỏ
  const handleZoom = (direction: 'in' | 'out', clientX?: number, clientY?: number) => {
    if (!canvasRef.current) return;
    
    setScale(prevScale => {
      // Tính toán tỉ lệ mới
      const oldScale = prevScale;
      const newScale = direction === 'in' 
        ? Math.min(prevScale + 0.1, 3) 
        : Math.max(prevScale - 0.1, 0.5);
      
      // Nếu có vị trí chuột, zoom vào điểm đó
      if (clientX !== undefined && clientY !== undefined) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        // Tính toán vị trí mới cho điểm gốc
        const newPosition = {
          x: x - (x - position.x) * (newScale / oldScale),
          y: y - (y - position.y) * (newScale / oldScale)
        };
        
        setPosition(newPosition);
      }
      
      return newScale;
    });
  };
  
  // Xử lý wheel event để phóng to/thu nhỏ
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const direction = e.deltaY < 0 ? 'in' : 'out';
      handleZoom(direction, e.clientX, e.clientY);
    } else {
      // Di chuyển canvas khi scroll
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };
  
  // Cập nhật handleCanvasClick
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Không xử lý click nếu đang panning
    if (isPanning) return;
    
    setSelectedComponent(null);
    setSelectedConnection(null);
    setConnectionStartInfo(null);
    clearMenuAndTimeout();
  };
  
  // Thả component vào canvas
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (!draggedComponent || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const logicPos = canvasToLogicPosition(e.clientX, e.clientY, rect, position, scale);
    
    createComponent(draggedComponent.type, draggedComponent.subtype as any, logicPos.x, logicPos.y);
    setDraggedComponent(null);
  };
  
  // Xử lý khi click vào port
  const handlePortClickWrapper = (portId: string, portType: 'input' | 'output', e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    handlePortClick(portId, portType, componentId);
  };
  
  // Thêm chức năng tạo biến input
  const createVariableInput = () => {
    // Tạo tên biến mặc định
    const variableName = 'var' + (components.filter(c => c.type === 'input' && c.subtype === 'VARIABLE').length + 1);
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      // Tính toán vị trí logic của điểm trung tâm
      const centerX = ((rect.width / 2) - position.x) / scale;
      const centerY = ((rect.height / 2) - position.y) / scale;
      
      createComponent('input', 'VARIABLE', centerX, centerY, { name: variableName });
    }
  };
  
  // Xóa tất cả
  const handleClearAll = () => {
    addToHistory(components, connections);
    setComponents([]);
    setConnections([]);
    setSelectedComponent(null);
    setSelectedConnection(null);
    setConnectionStartInfo(null);
  };
  
  // Xử lý undo
  const handleUndo = () => {
    const result = undo();
    if (result) {
      setComponents(result.components);
      setConnections(result.connections);
    }
  };
  
  // Xử lý redo
  const handleRedo = () => {
    const result = redo();
    if (result) {
      setComponents(result.components);
      setConnections(result.connections);
    }
  };
  
  // Xử lý startDragComponent với sự kiện e
  const handleStartDragComponent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    startDragComponent(id, e.clientX, e.clientY);
  };
  
  // Xử lý xóa component và các kết nối liên quan
  const handleDeleteComponent = (id: string) => {
    // Lưu trạng thái hiện tại vào lịch sử
    addToHistory(components, connections);
    
    // Xóa tất cả kết nối liên quan đến component
    const updatedConnections = deleteConnectionsForComponent(id);
    setConnections(updatedConnections);
    
    // Xóa component
    deleteComponent(id);
    clearMenuAndTimeout();
  };
  
  // Xử lý nhân bản component
  const handleDuplicateComponent = (id: string) => {
    // Lưu trạng thái hiện tại vào lịch sử
    addToHistory(components, connections);
    
    duplicateComponent(id);
    clearMenuAndTimeout();
  };
  
  // Xử lý xóa kết nối
  const handleDeleteConnection = (id: string) => {
    addToHistory(components, connections);
    deleteConnection(id);
  };

  // Xử lý khi click vào kết nối
  const handleConnectionClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedConnection(id);
    setSelectedComponent(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Chuyển đổi từ Connection sang CircuitConnection
      const circuitConnections = connections.map(conn => ({
        id: conn.id,
        fromComponent: conn.fromPort.componentId,
        toComponent: conn.toPort.componentId,
        fromPort: conn.fromPort.portId,
        toPort: conn.toPort.portId
      }));

      const circuit = {
        components,
        connections: circuitConnections
      };

      const { isValid, feedback } = CircuitValidator.validateCircuit(circuit, type);
      
      // Chuyển đổi mạch thành DAG
      const dag = convertCircuitToDAG(components, connections);
      
      // Kiểm tra có chu trình hay không
      const hasCycleInGraph = hasCycle(dag);
      
      if (hasCycleInGraph) {
        toast.warning("Warning: The circuit has a cycle, which may cause errors when simulating!");
      }
      
      if (isValid) {
        toast.success(feedback);
      } else {
        toast.error(feedback);
      }

      if (onSubmit) {
        onSubmit(isValid, dag);
      }
    } catch (error) {
      console.error('Error validating circuit:', error);
      toast.error('An error occurred while validating the circuit. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Thêm hàm reset view
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Thêm hàm xuất DAG ra file JSON
  const exportDAGToJSON = (dag: CircuitDAG) => {
    try {
      // Tạo một Blob chứa dữ liệu JSON
      const jsonStr = JSON.stringify(dag, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      
      // Tạo URL cho blob
      const url = URL.createObjectURL(blob);
      
      // Tạo một thẻ a để tải file
      const a = document.createElement('a');
      a.href = url;
      a.download = `circuit_dag_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      
      // Thêm vào document và click để download
      document.body.appendChild(a);
      a.click();
      
      // Dọn dẹp
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success('DAG has been exported to JSON file!');
    } catch (error) {
      console.error('Error exporting DAG:', error);
      toast.error('An error occurred while exporting the DAG!');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <Toolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearAll={handleClearAll}
        onToggleLibrary={() => setShowComponentLibrary(!showComponentLibrary)}
        onCreateVariable={createVariableInput}
        canUndo={canUndo}
        canRedo={canRedo}
        showLibrary={showComponentLibrary}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Component Library */}
        <ComponentLibrary
          visible={showComponentLibrary}
          onShowLibrary={() => setShowComponentLibrary(true)}
          onStartDrag={startDrag}
        />
        
        {/* Zoom Controls */}
        <div className="absolute bottom-20 right-4 z-20 flex flex-col gap-2 bg-white p-2 rounded-md shadow-md">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => {
              if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                handleZoom('in', centerX, centerY);
              }
            }}
            title="Phóng to"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => {
              if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                handleZoom('out', centerX, centerY);
              }
            }}
            title="Thu nhỏ"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={resetView}
            title="Đặt lại vị trí khung nhìn"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <div className="text-center text-xs py-1">{Math.round(scale * 100)}%</div>
        </div>
        
        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-white"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={(e) => {
            stopDragging();
            stopPanning();
          }}
          onMouseDown={startPanning}
          onWheel={handleWheel}
          style={{ cursor: isPanning ? 'grabbing' : 'default' }}
        >
          {/* Grid background container */}
          <div 
            className="absolute" 
            style={{ 
              width: '200vw', 
              height: '200vh',
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: '0 0',
              backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)', 
              backgroundSize: '20px 20px',
              backgroundRepeat: 'repeat',
              backgroundColor: 'white',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1
            }}
          >
            {/* Render all connections */}
            {connections.map(connection => (
              <Connection 
                key={connection.id} 
                connection={connection} 
                isSelected={selectedConnection === connection.id}
                onDelete={handleDeleteConnection}
                onClick={(e) => handleConnectionClick(connection.id, e)}
              />
            ))}
            
            {/* Render temporary connection while connecting */}
            {connectionStartInfo && (
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {(() => {
                  const startComponent = components.find(c => c.id === connectionStartInfo.componentId);
                  if (!startComponent) return null;
                  
                  const ports = connectionStartInfo.portType === 'input' ? startComponent.inputs : startComponent.outputs;
                  const portIndex = ports.findIndex(p => p.id === connectionStartInfo.portId);
                  
                  let startX, startY;
                  if (connectionStartInfo.portType === 'input') {
                    const pos = { x: startComponent.x - startComponent.width / 3, y: startComponent.y - startComponent.height / 3 + portIndex * (startComponent.height / 2) };
                    startX = pos.x;
                    startY = pos.y;
                  } else {
                    const pos = { x: startComponent.x + startComponent.width / 3, y: startComponent.y };
                    startX = pos.x;
                    startY = pos.y;
                  }
                  
                  return (
                    <path
                      d={`M ${startX} ${startY} L ${mousePosition.x} ${mousePosition.y}`}
                      stroke="#2196F3"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      fill="none"
                    />
                  );
                })()}
              </svg>
            )}
            
            {/* Render all components */}
            {components.map((component) => (
              <div 
                key={component.id}
                className={`absolute cursor-move transition-transform ${selectedComponent === component.id ? 'ring-2 ring-tutu-500 ring-offset-2' : ''}`}
                style={{ 
                  left: component.x, 
                  top: component.y, 
                  transform: 'translate(-50%, -50%)',
                  zIndex: hoveredComponent === component.id ? 10 : 1 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleComponentClick(component.id);
                }}
                onMouseDown={(e) => {
                  if (!isPanning) handleStartDragComponent(component.id, e);
                }}
                onMouseEnter={() => handleComponentMouseEnter(component.id)}
                onMouseLeave={handleComponentMouseLeave}
              >
                <HoverMenu
                  componentId={component.id}
                  visible={menuVisible === component.id}
                  onDelete={handleDeleteComponent}
                  onDuplicate={handleDuplicateComponent}
                  onDrag={handleStartDragComponent}
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                />
                
                {component.type === 'gate' && (
                  <LogicGate 
                    component={component}
                    isSelected={selectedComponent === component.id}
                    onPortClick={(portId, portType, e) => handlePortClickWrapper(portId, portType, e, component.id)}
                    onAddInput={() => addInputToComponent(component.id)}
                    onRemoveInput={() => removeInputFromComponent(component.id)}
                    onResize={(id) => resizeComponent(id, { width: 10, height: 10 })}
                  />
                )}
                
                {component.type === 'flipflop' && (
                  <FlipFlop 
                    component={component}
                    isSelected={selectedComponent === component.id}
                    onPortClick={(portId, portType, e) => handlePortClickWrapper(portId, portType, e, component.id)}
                    onResize={(id) => resizeComponent(id, { width: 10, height: 10 })}
                  />
                )}
                
                {(component.type === 'input' || component.type === 'output') && (
                  <InputOutput 
                    component={component}
                    isSelected={selectedComponent === component.id}
                    onPortClick={(portId, portType, e) => handlePortClickWrapper(portId, portType, e, component.id)}
                    onToggleState={() => toggleComponentState(component.id)}
                    onEditName={(newName) => editVariableName(component.id, newName)}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Canvas info overlay */}
          <div className="absolute left-4 bottom-4 z-20 text-xs text-gray-500 bg-white/80 p-2 rounded-md shadow-sm">
            <p>Move component: Click and hold the middle mouse button or Alt+left-click</p>
            <p>Zoom in/out: Ctrl+scroll or use the zoom in/out buttons</p>
            <p>Undo: Alt+Z, Redo: Alt+Y</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || components.length === 0}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Checking...' : 'Submit circuit'}
        </Button>
        
        <Button
          onClick={() => {
            const dag = convertCircuitToDAG(components, connections);
            exportDAGToJSON(dag);
          }}
          disabled={components.length === 0}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          Export DAG
        </Button>
      </div>
    </div>
  );
};

export default DigitalLogicCanvas; 