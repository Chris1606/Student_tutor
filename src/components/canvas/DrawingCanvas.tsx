
import React, { useState, useRef, useEffect } from 'react';
import { 
  Pencil, 
  Square, 
  Circle, 
  Triangle, 
  Scissors,
  ChevronDown,
  RefreshCw,
  Save,
  Type,
  ArrowDownRight,
  LineChart,
  Grid3X3
} from 'lucide-react';

type Tool = 'pencil' | 'square' | 'circle' | 'triangle' | 'text' | 'line' | 'function' | 'eraser';

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [showGrid, setShowGrid] = useState(true);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match container
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth - 20;
      canvas.height = container.clientHeight - 60;
    }
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
  }, [showGrid]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    
    // Draw horizontal grid lines
    const gridSize = 20;
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw vertical grid lines
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw coordinate axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    
    // x-axis
    const xAxis = Math.floor(height / 2);
    ctx.beginPath();
    ctx.moveTo(0, xAxis);
    ctx.lineTo(width, xAxis);
    ctx.stroke();
    
    // y-axis
    const yAxis = Math.floor(width / 2);
    ctx.beginPath();
    ctx.moveTo(yAxis, 0);
    ctx.lineTo(yAxis, height);
    ctx.stroke();
    
    ctx.restore();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setLastPos({ x, y });
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (selectedTool === 'pencil' || selectedTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      if (selectedTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 10;
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedTool === 'pencil' || selectedTool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const finishDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedTool === 'pencil' || selectedTool === 'eraser') {
      ctx.closePath();
      ctx.globalCompositeOperation = 'source-over';
    } else if (selectedTool === 'square') {
      const width = x - lastPos.x;
      const height = y - lastPos.y;
      ctx.strokeRect(lastPos.x, lastPos.y, width, height);
    } else if (selectedTool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - lastPos.x, 2) + Math.pow(y - lastPos.y, 2));
      ctx.beginPath();
      ctx.arc(lastPos.x, lastPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (selectedTool === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.lineTo(lastPos.x - (x - lastPos.x), y);
      ctx.closePath();
      ctx.stroke();
    } else if (selectedTool === 'line') {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (selectedTool === 'function') {
      drawFunction(ctx, canvas.width, canvas.height);
    }
    
    setIsDrawing(false);
  };

  const drawFunction = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Simple example - draw a sine wave
    const centerY = height / 2;
    const amplitude = 50;
    const frequency = 0.05;
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    
    for (let x = 0; x < width; x++) {
      const y = centerY + amplitude * Math.sin(frequency * x);
      ctx.lineTo(x, y);
    }
    
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'tutu-drawing.png';
    link.href = dataUrl;
    link.click();
  };

  const tools = [
    { id: 'pencil', icon: <Pencil size={18} />, label: 'Pencil' },
    { id: 'square', icon: <Square size={18} />, label: 'Square' },
    { id: 'circle', icon: <Circle size={18} />, label: 'Circle' },
    { id: 'triangle', icon: <Triangle size={18} />, label: 'Triangle' },
    { id: 'line', icon: <ArrowDownRight size={18} />, label: 'Line' },
    { id: 'function', icon: <LineChart size={18} />, label: 'Function' },
    { id: 'text', icon: <Type size={18} />, label: 'Text' },
    { id: 'eraser', icon: <Scissors size={18} />, label: 'Eraser' }
  ];

  return (
    <div className="canvas-container flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex justify-between items-center p-2 border-b border-border">
        {/* Drawing tools */}
        <div className="flex space-x-1">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id as Tool)}
              className={`p-1.5 rounded-md ${selectedTool === tool.id ? 'bg-tutu-100 text-tutu-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>
        
        {/* Options */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-md ${showGrid ? 'bg-tutu-100 text-tutu-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
            title="Toggle Grid"
          >
            <Grid3X3 size={18} />
          </button>
          
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-6 rounded-md border border-gray-300 cursor-pointer"
            title="Select Color"
          />
          
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            title="Clear Canvas"
          >
            <RefreshCw size={18} />
          </button>
          
          <button
            onClick={saveCanvas}
            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            title="Save Image"
          >
            <Save size={18} />
          </button>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 overflow-hidden p-2">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          className="bg-white w-full h-full cursor-crosshair border border-gray-100 rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
};

export default DrawingCanvas;
