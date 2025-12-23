import React, { useEffect } from 'react';
import { Connection as ConnectionType } from '../types';

interface ConnectionProps {
  connection: ConnectionType;
  isSelected: boolean;
  onDelete: (id: string) => void;
}

const Connection: React.FC<ConnectionProps> = ({ connection, isSelected, onDelete }) => {
  const { id, fromPort, toPort, points } = connection;

  // Debug thông tin kết nối
  useEffect(() => {
    console.log('Connection rendered:', {
      id, 
      from: { x: fromPort.x, y: fromPort.y, componentId: fromPort.componentId, portId: fromPort.portId }, 
      to: { x: toPort.x, y: toPort.y, componentId: toPort.componentId, portId: toPort.portId }
    });
  }, [id, fromPort, toPort]);

  // Kiểm tra nếu vị trí cổng không hợp lệ
  if (!fromPort.x || !fromPort.y || !toPort.x || !toPort.y) {
    return null;
  }
  
  const startX = fromPort.x;
  const startY = fromPort.y;
  const endX = toPort.x;
  const endY = toPort.y;
  
  // Tính toán đường cong Bezier cho kết nối
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Tạo đường cong tự nhiên với điểm điều khiển
  const offsetX = Math.min(100, distance / 2);
  const pathD = `M ${startX} ${startY} 
                 C ${startX + offsetX} ${startY}, 
                   ${endX - offsetX} ${endY}, 
                   ${endX} ${endY}`;
  
  // Tạo điểm trung gian để làm nơi click xóa kết nối
  const midpointX = (startX + endX) / 2;
  const midpointY = (startY + endY) / 2;
  
  // Tính vị trí mũi tên
  const arrowLength = 10;
  const arrowWidth = 6;
  
  // Góc của đường thẳng nối hai điểm
  const angle = Math.atan2(endY - startY, endX - startX);
  
  // Vị trí mũi tên (gần đầu vào một chút)
  const arrowX = endX - 12 * Math.cos(angle);
  const arrowY = endY - 12 * Math.sin(angle);
  
  // Tạo các điểm cho mũi tên
  const arrowPoints = [
    { x: arrowX, y: arrowY },
    { x: arrowX - arrowLength * Math.cos(angle - Math.PI/6), y: arrowY - arrowLength * Math.sin(angle - Math.PI/6) },
    { x: arrowX - arrowLength * Math.cos(angle + Math.PI/6), y: arrowY - arrowLength * Math.sin(angle + Math.PI/6) }
  ];
  
  const arrowPath = `M ${arrowPoints[0].x} ${arrowPoints[0].y} 
                    L ${arrowPoints[1].x} ${arrowPoints[1].y} 
                    L ${arrowPoints[2].x} ${arrowPoints[2].y} 
                    Z`;
  
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      {/* Đường kết nối */}
      <path
        d={pathD}
        stroke={isSelected ? "#2196F3" : "#555"}
        strokeWidth={isSelected ? "3" : "2"}
        fill="none"
      />
      
      {/* Mũi tên */}
      <path
        d={arrowPath}
        fill={isSelected ? "#2196F3" : "#555"}
        stroke="none"
      />
      
      {/* Nút xóa kết nối (chỉ hiển thị khi được chọn) */}
      {isSelected && (
        <g 
          transform={`translate(${midpointX}, ${midpointY})`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          style={{ pointerEvents: 'all' }}
        >
          <circle cx="0" cy="0" r="10" fill="#f44336" />
          <text x="0" y="4" fontSize="14" textAnchor="middle" fill="white" fontWeight="bold">×</text>
        </g>
      )}
      
      {/* Vùng tương tác để chọn kết nối */}
      <path
        d={pathD}
        stroke="transparent"
        strokeWidth="10"
        fill="none"
        style={{ pointerEvents: 'all', cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          // Gọi callback để chọn kết nối này
        }}
      />
    </svg>
  );
};

export default Connection; 