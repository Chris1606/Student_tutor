import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ChevronLeft, ChevronRight, CircuitBoard, Maximize2, Waves, FolderOpen, Save, Minimize2, Send, Table } from 'lucide-react';
import DrawingCanvas from '../canvas/DrawingCanvas';
import DigitalLogicCanvas from '../practiceCanvas/DigitalLogicCanvas';
import WaveformCanvas from '../practiceCanvas/WaveformCanvas';
import KmapCanvas from '../practiceCanvas/KmapCanvas';

type TabType = 'canvas' | 'digital-logic' | 'waveform' | 'kmap';

const suggestions = {
  'multiple-choice': {
    // Nội dung cho câu hỏi trắc nghiệm
  },
  'problem-solving': {
    // Nội dung cho câu hỏi giải quyết vấn đề
  }
};

const RightPanel = () => {
  const { isPanelExpanded, togglePanelExpanded } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('digital-logic');
  const [panelWidth, setPanelWidth] = useState(400); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(500); // Default height
  const [isHeightResizing, setIsHeightResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const heightResizeHandleRef = useRef<HTMLDivElement>(null);
  const minWidth = 350;
  const maxWidth = 800;
  const minHeight = 300;
  const maxHeight = 800;

  // Xử lý resize panel width
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !panelRef.current) return;
      
      const containerRect = panelRef.current.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      
      // Tính toán width mới dựa trên vị trí chuột
      // Chiều rộng mới sẽ là khoảng cách từ cạnh phải của container đến vị trí chuột
      const newWidth = containerRect.right - e.clientX;
      
      // Giới hạn width trong khoảng min-max
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      
      setPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Xử lý resize panel height
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHeightResizing || !panelRef.current) return;
      
      const rect = panelRef.current.getBoundingClientRect();
      const newHeight = e.clientY - rect.top - 100; // 100px là khoảng cách từ top đến đầu canvas
      
      // Giới hạn height trong khoảng min-max
      const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
      
      setCanvasHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsHeightResizing(false);
    };

    if (isHeightResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isHeightResizing]);

  // Bắt đầu resize chiều rộng khi nhấn chuột vào nút resize
  const startResizing = () => {
    setIsResizing(true);
  };

  // Bắt đầu resize chiều cao khi nhấn chuột vào nút resize dưới
  const startHeightResizing = () => {
    setIsHeightResizing(true);
  };

  // Mở rộng panel to toàn màn hình
  const expandFullScreen = () => {
    setPanelWidth(maxWidth);
    setCanvasHeight(maxHeight);
  };

  // Thu nhỏ panel về kích thước mặc định
  const resetSize = () => {
    setPanelWidth(400);
    setCanvasHeight(500);
  };

  // Xử lý khi nhấn nút submit
  const handleSubmit = () => {
    // Xử lý logic submit của bài tập tùy thuộc vào activeTab
    alert(`Đã submit ${activeTab === 'canvas' ? 'bản vẽ' : activeTab === 'digital-logic' ? 'mạch điện tử' : activeTab === 'waveform' ? 'biểu đồ waveform' : 'k-map'}`);
    // Có thể thêm logic gửi dữ liệu lên server ở đây
  };

  return (
    <div 
      ref={panelRef}
      className={`h-full border-l border-border transition-all ease-in-out relative ${isPanelExpanded ? 'bg-white' : 'w-0'}`}
      style={{ width: isPanelExpanded ? `${panelWidth}px` : '0px' }}
    >
      {/* Toggle Button - Always visible */}
      <button 
        onClick={togglePanelExpanded}
        className={`fixed ${isPanelExpanded ? 'right-[400px]' : 'right-0'} top-4 w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center shadow-md z-30 hover:bg-gray-50 transition-all duration-300`}
        style={{ right: isPanelExpanded ? `${panelWidth}px` : '10px' }}
        title={isPanelExpanded ? "Thu gọn panel" : "Mở rộng panel"}
      >
        {isPanelExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
      
      {/* Resize handle */}
      {isPanelExpanded && (
        <div 
          ref={resizeHandleRef}
          className="absolute left-0 top-0 h-full w-1 cursor-col-resize hover:bg-tutu-400 hover:opacity-50 z-20"
          onMouseDown={startResizing}
        />
      )}
      
      {isPanelExpanded && (
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="h-16 border-b border-border px-4 flex items-center justify-between">
            <h3 className="font-medium">Interactive tools</h3>
            <div className="flex gap-2">
              <button 
                className="p-1.5 hover:bg-gray-100 rounded-md text-muted-foreground"
                onClick={resetSize}
                title="Size default"
              >
                <Minimize2 size={18} />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-100 rounded-md text-muted-foreground"
                onClick={expandFullScreen}
                title="Expand"
              >
                <Maximize2 size={18} />
              </button>
              <button 
                className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
                onClick={handleSubmit}
                title="Submit"
              >
                <Send size={16} />
                <span className="text-sm">Submit</span>
              </button>
            </div>
          </div>
          
          {/* Panel Tab Navigation */}
          <div className="h-12 border-b border-border flex items-center px-2">
            <div className="grid grid-cols-4 w-full bg-gray-100 p-1 rounded-md gap-1">
              <button 
                onClick={() => setActiveTab('canvas')}
                className={`py-1.5 px-3 rounded-md text-sm flex items-center justify-center gap-1.5 font-medium transition-colors ${activeTab === 'canvas' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Maximize2 size={14} />
                <span>Free drawing</span>
              </button>
              <button 
                onClick={() => setActiveTab('digital-logic')}
                className={`py-1.5 px-3 rounded-md text-sm flex items-center justify-center gap-1.5 font-medium transition-colors ${activeTab === 'digital-logic' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <CircuitBoard size={14} />
                <span>Digital electronics</span>
              </button>
              <button 
                onClick={() => setActiveTab('waveform')}
                className={`py-1.5 px-3 rounded-md text-sm flex items-center justify-center gap-1.5 font-medium transition-colors ${activeTab === 'waveform' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Waves size={14} />
                <span>Waveform</span>
              </button>
              <button 
                onClick={() => setActiveTab('kmap')}
                className={`py-1.5 px-3 rounded-md text-sm flex items-center justify-center gap-1.5 font-medium transition-colors ${activeTab === 'kmap' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Table size={14} />
                <span>K-map</span>
              </button>
            </div>
          </div>
          
          {/* Panel Content với chiều cao có thể điều chỉnh */}
          <div 
            className="flex-1 p-2 overflow-auto relative" 
            style={{ height: `${canvasHeight}px` }}
          >
            <div className="h-full overflow-hidden">
              {activeTab === 'canvas' && <DrawingCanvas />}
              {activeTab === 'digital-logic' && <DigitalLogicCanvas />}
              {activeTab === 'waveform' && <WaveformCanvas />}
              {activeTab === 'kmap' && (
                <KmapCanvas
                  variables={4}
                  minterms={[0, 1, 5, 6, 7, 11, 12, 14]}
                  dontCares={[3, 8, 13]}
                  onComplete={(expression) => {
                    console.log('K-map solution:', expression);
                  }}
                />
              )}
            </div>
            
            {/* Height resize handle */}
            <div 
              ref={heightResizeHandleRef}
              className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize hover:bg-tutu-400 hover:opacity-50 z-20"
              onMouseDown={startHeightResizing}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
