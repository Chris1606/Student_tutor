import { useState } from 'react';
import { LogicComponent } from '../types';
import { generateId } from '../utils';

export const useComponentManager = () => {
  const [components, setComponents] = useState<LogicComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [draggedComponent, setDraggedComponent] = useState<{type: 'gate' | 'flipflop' | 'input' | 'output', subtype: string} | null>(null);

  // Tạo một component mới
  const createComponent = (type: 'gate' | 'flipflop' | 'input' | 'output', subtype: string, x: number, y: number, options?: any) => {
    const componentId = generateId();
    
    // Tạo inputs/outputs dựa vào loại component
    let inputs = [];
    let outputs = [];
    
    if (type === 'gate') {
      if (subtype === 'NOT') {
        inputs = [{ id: generateId(), name: '' }];
      } else {
        inputs = [
          { id: generateId(), name: '' },
          { id: generateId(), name: '' },
        ];
      }
      outputs = [{ id: generateId(), name: '' }];
    } else if (type === 'flipflop') {
      if (subtype === 'JK') {
        inputs = [
          { id: generateId(), name: 'J' },
          { id: generateId(), name: 'K' },
          { id: generateId(), name: 'CLK' }
        ];
      } else if (subtype === 'D') {
        inputs = [
          { id: generateId(), name: 'D' },
          { id: generateId(), name: 'CLK' }
        ];
      }
      outputs = [
        { id: generateId(), name: 'Q' },
        { id: generateId(), name: 'Q̅' }
      ];
    } else if (type === 'input') {
      if (subtype === 'VARIABLE') {
        outputs = [{ id: generateId(), name: '' }];
      } else {
        outputs = [{ id: generateId(), name: '' }];
      }
    } else if (type === 'output') {
      inputs = [{ id: generateId(), name: 'in' }];
    }
    
    const newComponent: LogicComponent = {
      id: componentId,
      type,
      subtype: subtype as any,
      x,
      y,
      width: type === 'gate' ? 60 : type === 'flipflop' ? 80 : 40,
      height: type === 'gate' ? 60 : type === 'flipflop' ? 80 : 40,
      inputs,
      outputs,
      state: type === 'input' && (subtype === 'HIGH' || subtype === 'CLOCK') ? true : false,
      name: options?.name || ''
    };
    
    setComponents(prev => [...prev, newComponent]);
    return newComponent;
  };

  // Xóa một component
  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    
    // Reset các trạng thái liên quan
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
    
    if (hoveredComponent === id) {
      setHoveredComponent(null);
    }
    
    if (menuVisible === id) {
      setMenuVisible(null);
    }
  };

  // Nhân bản một component
  const duplicateComponent = (id: string) => {
    const component = components.find(comp => comp.id === id);
    if (!component) return null;
    
    return createComponent(
      component.type, 
      component.subtype, 
      component.x + 20, 
      component.y + 20,
      {
        name: `${component.name}_copy`
      }
    );
  };

  // Thêm đầu vào cho component
  const addInputToComponent = (id: string) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === id) {
        const newInputId = generateId();
        const newInputName = `in${comp.inputs.length + 1}`;
        return {
          ...comp,
          inputs: [...comp.inputs, { id: newInputId, name: newInputName }]
        };
      }
      return comp;
    }));
  };

  // Xóa đầu vào cho component
  const removeInputFromComponent = (id: string) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === id && comp.inputs.length > 1) {
        return {
          ...comp,
          inputs: comp.inputs.slice(0, -1)
        };
      }
      return comp;
    }));
  };

  // Điều chỉnh kích thước component
  const resizeComponent = (id: string, change: { width?: number, height?: number }) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === id) {
        return {
          ...comp,
          width: change.width ? Math.max(30, comp.width + change.width) : comp.width,
          height: change.height ? Math.max(30, comp.height + change.height) : comp.height
        };
      }
      return comp;
    }));
  };

  // Toggle trạng thái component (cho input và led)
  const toggleComponentState = (id: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id && (comp.type === 'input' || (comp.type === 'output' && comp.subtype === 'LED')) 
        ? { ...comp, state: !comp.state } 
        : comp
    ));
  };

  // Chỉnh sửa tên biến
  const editVariableName = (componentId: string, newName: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === componentId ? { ...comp, name: newName } : comp
    ));
  };

  // Chuẩn bị kéo component
  const startDrag = (type: 'gate' | 'flipflop' | 'input' | 'output', subtype: string) => {
    setDraggedComponent({ type, subtype });
  };

  // Bắt đầu kéo thả component có sẵn
  const startDragComponent = (id: string, clientX: number, clientY: number) => {
    setIsDragging(true);
    setSelectedComponent(id);
    
    // Lưu vị trí chuột tại thời điểm bắt đầu kéo
    setStartPosition({ x: clientX, y: clientY });
    
    setMenuVisible(null);
  };

  // Cập nhật vị trí khi kéo component
  const updateDraggedComponent = (logicX: number, logicY: number) => {
    if (isDragging && selectedComponent) {
      const component = components.find(c => c.id === selectedComponent);
      if (!component) return null;
      
      // Luôn đặt component tại vị trí chuột trong không gian logic
      setComponents(prev => prev.map(comp => 
        comp.id === selectedComponent
          ? { ...comp, x: logicX, y: logicY }
          : comp
      ));
      
      return selectedComponent; // Trả về ID component đang được kéo
    }
    return null;
  };

  // Kết thúc kéo thả
  const stopDragging = () => {
    setIsDragging(false);
  };

  // Xử lý khi click vào component
  const handleComponentClick = (id: string) => {
    setSelectedComponent(id === selectedComponent ? null : id);
  };

  return {
    components,
    setComponents,
    selectedComponent,
    setSelectedComponent,
    hoveredComponent,
    setHoveredComponent,
    menuVisible,
    setMenuVisible,
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
  };
}; 