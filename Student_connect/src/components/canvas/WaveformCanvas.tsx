import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Undo2, Redo2, Save, Trash2, ZoomIn, ZoomOut, Plus, Minus } from 'lucide-react';

interface WaveformSignal {
  id: string;
  name: string;
  values: boolean[];
  color: string;
}

const DEFAULT_SIGNALS: WaveformSignal[] = [
  {
    id: '1',
    name: 'Clock',
    values: Array(16).fill(false).map((_, i) => i % 2 === 0),
    color: '#3b82f6'
  },
  {
    id: '2',
    name: 'Data',
    values: [false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true],
    color: '#10b981'
  },
  {
    id: '3',
    name: 'Enable',
    values: [false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false],
    color: '#ef4444'
  },
  {
    id: '4',
    name: 'Output',
    values: [false, false, false, false, false, false, true, true, false, false, true, true, false, false, false, false],
    color: '#8b5cf6'
  }
];

const WaveformCanvas = () => {
  const [signals, setSignals] = useState<WaveformSignal[]>(DEFAULT_SIGNALS);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [timeScale, setTimeScale] = useState(40); // pixels per time unit
  const [editMode, setEditMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Xử lý vẽ waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawWaveform = () => {
      // Thiết lập kích thước canvas
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = signals.length * 60 + 40; // 60px per signal + header
      }
      
      // Xóa canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Vẽ grid
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      
      // Vẽ grid dọc (thời gian)
      for (let i = 0; i <= signals[0]?.values.length || 0; i++) {
        const x = 100 + i * timeScale;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        
        // Vẽ số thời gian
        if (i < signals[0]?.values.length) {
          ctx.fillStyle = '#9ca3af';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(i.toString(), x + timeScale/2, 20);
        }
      }
      
      // Vẽ các tín hiệu
      signals.forEach((signal, index) => {
        const y = 40 + index * 60;
        
        // Vẽ tên tín hiệu
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(signal.name, 10, y + 20);
        
        // Vẽ đường waveform
        ctx.strokeStyle = signal.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        signal.values.forEach((value, i) => {
          const x1 = 100 + i * timeScale;
          const x2 = 100 + (i + 1) * timeScale;
          const y1 = value ? y : y + 30;
          const y2 = signal.values[i + 1] ? y : y + 30;
          
          if (i === 0) {
            ctx.moveTo(x1, y1);
          }
          
          // Vẽ phần ngang của tín hiệu
          ctx.lineTo(x2, y1);
          
          // Nếu không phải giá trị cuối cùng và có thay đổi trạng thái
          if (i < signal.values.length - 1 && value !== signal.values[i + 1]) {
            ctx.lineTo(x2, y2);
          }
        });
        
        ctx.stroke();
        
        // Highlight signal được chọn
        if (selectedSignal === signal.id) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
          ctx.fillRect(0, y - 15, canvas.width, 50);
        }
      });
    };
    
    drawWaveform();
  }, [signals, selectedSignal, timeScale]);
  
  // Thêm tín hiệu mới
  const addSignal = () => {
    const newSignal: WaveformSignal = {
      id: Date.now().toString(),
      name: `Signal ${signals.length + 1}`,
      values: Array(signals[0]?.values.length || 16).fill(false),
      color: getRandomColor()
    };
    
    setSignals([...signals, newSignal]);
  };
  
  // Xóa tín hiệu
  const removeSignal = (id: string) => {
    setSignals(signals.filter(s => s.id !== id));
    if (selectedSignal === id) {
      setSelectedSignal(null);
    }
  };
  
  // Lấy màu ngẫu nhiên cho tín hiệu mới
  const getRandomColor = () => {
    const colors = ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Xử lý click trên canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!editMode) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Tìm tín hiệu được click
    const signalIndex = Math.floor((y - 40) / 60);
    if (signalIndex < 0 || signalIndex >= signals.length) return;
    
    // Tìm vị trí thời gian được click
    const timeIndex = Math.floor((x - 100) / timeScale);
    if (timeIndex < 0 || timeIndex >= signals[0].values.length) return;
    
    // Cập nhật giá trị
    const newSignals = [...signals];
    newSignals[signalIndex].values[timeIndex] = !newSignals[signalIndex].values[timeIndex];
    setSignals(newSignals);
  };
  
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  const zoomIn = () => {
    setTimeScale(prev => Math.min(prev + 10, 100));
  };
  
  const zoomOut = () => {
    setTimeScale(prev => Math.max(prev - 10, 20));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tools */}
      <div className="bg-gray-100 p-2 flex gap-2 border-b border-border">
        <button 
          className={`p-1.5 ${editMode ? 'bg-tutu-100 text-tutu-600' : 'bg-white'} border border-border rounded-md hover:bg-gray-50 transition-colors`}
          onClick={toggleEditMode}
          title="Chỉnh sửa"
        >
          <Pencil size={16} />
        </button>
        <button 
          className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
          onClick={zoomIn}
          title="Phóng to"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
          onClick={zoomOut}
          title="Thu nhỏ"
        >
          <ZoomOut size={16} />
        </button>
        <div className="flex-1"></div>
        <button 
          className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
          onClick={addSignal}
          title="Thêm tín hiệu"
        >
          <Plus size={16} />
        </button>
        <button 
          className="p-1.5 bg-white border border-border rounded-md hover:bg-gray-50 transition-colors"
          title="Lưu"
        >
          <Save size={16} />
        </button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Signal List */}
        <div className="w-32 border-r border-border bg-gray-50 flex flex-col overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">Các tín hiệu</div>
            <div className="space-y-1">
              {signals.map(signal => (
                <div 
                  key={signal.id}
                  className={`p-2 text-xs rounded cursor-pointer flex items-center justify-between ${selectedSignal === signal.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedSignal(signal.id)}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: signal.color }}
                    ></div>
                    <span>{signal.name}</span>
                  </div>
                  {signals.length > 1 && (
                    <button 
                      className="text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSignal(signal.id);
                      }}
                    >
                      <Minus size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Canvas */}
        <div 
          ref={containerRef} 
          className="flex-1 bg-white overflow-auto p-2"
        >
          <canvas 
            ref={canvasRef} 
            onClick={handleCanvasClick}
            className={`${editMode ? 'cursor-pointer' : 'cursor-default'}`}
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default WaveformCanvas; 