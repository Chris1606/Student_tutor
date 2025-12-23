import { useState } from 'react';
import { LogicComponent, Connection } from '../types';

export const useHistory = () => {
  const [history, setHistory] = useState<{
    components: LogicComponent[][],
    connections: Connection[][],
    currentIndex: number
  }>({
    components: [],
    connections: [],
    currentIndex: -1
  });

  // Thêm snapshot hiện tại vào lịch sử
  const addToHistory = (components: LogicComponent[], connections: Connection[]) => {
    const newHistory = { ...history };
    
    // Cắt bỏ lịch sử từ vị trí hiện tại nếu đã có undo
    newHistory.components = newHistory.components.slice(0, newHistory.currentIndex + 1);
    newHistory.connections = newHistory.connections.slice(0, newHistory.currentIndex + 1);
    
    // Thêm trạng thái hiện tại vào lịch sử
    newHistory.components.push([...components]);
    newHistory.connections.push([...connections]);
    newHistory.currentIndex++;
    
    // Giới hạn số lượng lịch sử
    if (newHistory.components.length > 20) {
      newHistory.components.shift();
      newHistory.connections.shift();
      newHistory.currentIndex--;
    }
    
    setHistory(newHistory);
  };
  
  // Undo - quay về trạng thái trước đó
  const undo = (): { components: LogicComponent[], connections: Connection[] } | null => {
    if (history.currentIndex > 0) {
      const newIndex = history.currentIndex - 1;
      const newComponents = [...history.components[newIndex]];
      const newConnections = [...history.connections[newIndex]];
      
      setHistory({
        ...history,
        currentIndex: newIndex
      });
      
      return { components: newComponents, connections: newConnections };
    }
    return null;
  };
  
  // Redo - quay về trạng thái sau đó
  const redo = (): { components: LogicComponent[], connections: Connection[] } | null => {
    if (history.currentIndex < history.components.length - 1) {
      const newIndex = history.currentIndex + 1;
      const newComponents = [...history.components[newIndex]];
      const newConnections = [...history.connections[newIndex]];
      
      setHistory({
        ...history,
        currentIndex: newIndex
      });
      
      return { components: newComponents, connections: newConnections };
    }
    return null;
  };

  // Kiểm tra xem có thể undo/redo được không
  const canUndo = history.currentIndex > 0;
  const canRedo = history.currentIndex < history.components.length - 1;

  // Kiểm tra nếu trạng thái hiện tại khác với trạng thái đã lưu
  const shouldAddToHistory = (components: LogicComponent[], connections: Connection[]): boolean => {
    if (history.currentIndex === -1 && components.length === 0 && connections.length === 0) {
      return true; // Lần đầu tiên
    } else if (
      history.currentIndex >= 0 && 
      (JSON.stringify(components) !== JSON.stringify(history.components[history.currentIndex]) ||
       JSON.stringify(connections) !== JSON.stringify(history.connections[history.currentIndex]))
    ) {
      return true; // Có sự thay đổi
    }
    return false;
  }

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    shouldAddToHistory
  };
}; 