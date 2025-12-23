import { useState, useRef } from 'react';

export const useContextMenu = () => {
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Xử lý khi hover vào component
  const handleComponentMouseEnter = (id: string) => {
    setHoveredComponent(id);
    
    // Xóa timeout cũ nếu có
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    
    // Hiển thị menu sau một khoảng thời gian ngắn
    menuTimeoutRef.current = setTimeout(() => {
      setMenuVisible(id);
    }, 300);
  };

  // Xử lý khi hover ra khỏi component
  const handleComponentMouseLeave = () => {
    setHoveredComponent(null);
    
    // Xóa timeout hiện tại
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    
    // Đặt timeout mới để ẩn menu
    menuTimeoutRef.current = setTimeout(() => {
      setMenuVisible(null);
    }, 300);
  };

  // Xử lý khi hover vào menu
  const handleMenuMouseEnter = () => {
    // Xóa timeout nếu có
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
  };

  // Xử lý khi hover ra khỏi menu
  const handleMenuMouseLeave = () => {
    // Đặt timeout để ẩn menu
    menuTimeoutRef.current = setTimeout(() => {
      setMenuVisible(null);
    }, 300);
  };

  // Xóa menu và timeout
  const clearMenuAndTimeout = () => {
    setMenuVisible(null);
    setHoveredComponent(null);
    
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
  };

  return {
    menuVisible,
    setMenuVisible,
    hoveredComponent,
    setHoveredComponent,
    handleComponentMouseEnter,
    handleComponentMouseLeave,
    handleMenuMouseEnter,
    handleMenuMouseLeave,
    clearMenuAndTimeout,
  };
}; 