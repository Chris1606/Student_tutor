import React from 'react';
import { 
  Undo2, 
  Redo2,
  Save,
  Trash2,
  Zap,
  PlusCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClearAll: () => void;
  onToggleLibrary: () => void;
  onCreateVariable: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showLibrary: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onUndo,
  onRedo,
  onClearAll,
  onToggleLibrary,
  onCreateVariable,
  canUndo,
  canRedo,
  showLibrary
}) => {
  return (
    <div className="bg-gray-100 p-2 flex gap-2 border-b border-border">
      <button 
        className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
        onClick={onUndo}
        disabled={!canUndo}
        title="Hoàn tác"
      >
        <Undo2 size={16} className={!canUndo ? "text-gray-300" : "text-gray-700"} />
      </button>
      <button 
        className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
        onClick={onRedo}
        disabled={!canRedo}
        title="Làm lại"
      >
        <Redo2 size={16} className={!canRedo ? "text-gray-300" : "text-gray-700"} />
      </button>
      <div className="flex-1"></div>
      <button 
        className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
        onClick={onToggleLibrary}
        title={showLibrary ? "Ẩn thư viện" : "Hiện thư viện"}
      >
        {showLibrary ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      <button 
        className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
        onClick={onCreateVariable}
        title="Thêm biến"
      >
        <PlusCircle size={16} />
      </button>
      <button 
        className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
        title="Chạy mô phỏng"
      >
        <Zap size={16} />
      </button>
      <button 
        className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
        title="Lưu"
      >
        <Save size={16} />
      </button>
      <button 
        className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
        onClick={onClearAll}
        title="Xóa tất cả"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default Toolbar; 