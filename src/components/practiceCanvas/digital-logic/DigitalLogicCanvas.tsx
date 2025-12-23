import React, { useRef, useEffect } from 'react';
import { useHistory } from './hooks/useHistory';
import { useComponentManager } from './hooks/useComponentManager';
import { useConnectionManager } from './hooks/useConnectionManager';
import { useContextMenu } from './hooks/useContextMenu';

import Toolbar from './components/Toolbar';
import ComponentLibrary from './components/ComponentLibrary';
import HoverMenu from './components/HoverMenu';
import Connection from './components/Connection';
import LogicGate from './components/LogicGate';
import FlipFlop from './components/FlipFlop';
import InputOutput from './components/InputOutput';

import { generateId } from './utils';

const DigitalLogicCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showComponentLibrary, setShowComponentLibrary] = React.useState(true);
  
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
  
  // Xử lý cập nhật vị trí chuột
  const handleMouseMove = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      updateMousePosition(e.clientX - rect.left, e.clientY - rect.top);
    }
    
    if (isDragging) {
      const componentId = updateDraggedComponent(e.clientX, e.clientY);
      if (componentId) {
        updateConnectionsAfterMove(componentId);
      }
    }
  };
  
  // Click vào canvas (nền)
  const handleCanvasClick = () => {
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createComponent(draggedComponent.type, draggedComponent.subtype as any, x, y);
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
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
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
        
        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 bg-white relative overflow-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
        >
          {/* Grid background */}
          <div className="absolute inset-0 grid" style={{ backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Render all connections */}
          {connections.map(connection => (
            <Connection 
              key={connection.id} 
              connection={connection} 
              isSelected={selectedConnection === connection.id}
              onDelete={handleDeleteConnection}
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
              onMouseDown={(e) => handleStartDragComponent(component.id, e)}
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
      </div>
    </div>
  );
};

export default DigitalLogicCanvas; 