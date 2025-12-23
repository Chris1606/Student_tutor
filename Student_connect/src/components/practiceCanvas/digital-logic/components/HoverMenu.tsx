import React from 'react';
import { Trash2, Copy, Move } from 'lucide-react';

interface HoverMenuProps {
  componentId: string;
  visible: boolean;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDrag: (id: string, e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const HoverMenu: React.FC<HoverMenuProps> = ({
  componentId,
  visible,
  onDelete,
  onDuplicate,
  onDrag,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!visible) return null;

  return (
    <div 
      className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-md flex p-1 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan ra ngoài
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDuplicate(componentId);
        }}
        className="p-1 text-blue-500 hover:bg-blue-50 rounded-md"
        title="Nhân bản"
      >
        <Copy size={16} />
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDrag(componentId, e);
        }}
        className="p-1 text-gray-500 hover:bg-gray-50 rounded-md"
        title="Di chuyển"
      >
        <Move size={16} />
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDelete(componentId);
        }}
        className="p-1 text-red-500 hover:bg-red-50 rounded-md"
        title="Xóa"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default HoverMenu; 