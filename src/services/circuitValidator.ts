interface CircuitComponent {
  id: string;
  type: string;
  subtype: string;
  x: number;
  y: number;
  inputs: Array<{ id: string; name: string }>;
  outputs: Array<{ id: string; name: string }>;
}

interface CircuitConnection {
  id: string;
  fromComponent: string;
  toComponent: string;
  fromPort: string;
  toPort: string;
}

interface Circuit {
  components: CircuitComponent[];
  connections: CircuitConnection[];
}

export class CircuitValidator {
  static validateCounter(circuit: Circuit): { isValid: boolean; feedback: string } {
    // Kiểm tra số lượng D flip-flops
    const flipFlops = circuit.components.filter(c => c.type === 'flipflop' && c.subtype === 'D');
    if (flipFlops.length !== 4) {
      return {
        isValid: false,
        feedback: 'Mạch cần đúng 4 D flip-flops để tạo thành bộ đếm 4-bit'
      };
    }

    // Kiểm tra kết nối clock
    const clockConnections = circuit.connections.filter(conn => {
      const toComponent = circuit.components.find(c => c.id === conn.toComponent);
      return toComponent?.type === 'flipflop' && conn.toPort.includes('clock');
    });

    if (clockConnections.length !== 4) {
      return {
        isValid: false,
        feedback: 'Tất cả các D flip-flops phải được kết nối với tín hiệu clock'
      };
    }

    // Kiểm tra kết nối giữa các flip-flops
    const hasValidConnections = flipFlops.every((ff, index) => {
      if (index === 0) return true; // Flip-flop đầu tiên không cần kiểm tra đầu vào
      
      // Kiểm tra xem flip-flop hiện tại có được kết nối với flip-flop trước đó không
      const prevFF = flipFlops[index - 1];
      return circuit.connections.some(conn =>
        conn.fromComponent === prevFF.id && conn.toComponent === ff.id
      );
    });

    if (!hasValidConnections) {
      return {
        isValid: false,
        feedback: 'Các D flip-flops phải được kết nối tuần tự để tạo thành bộ đếm'
      };
    }

    return {
      isValid: true,
      feedback: 'Mạch đếm 4-bit đã được thiết kế đúng!'
    };
  }

  static validateCircuit(circuit: Circuit, type: string): { isValid: boolean; feedback: string } {
    switch (type) {
      case 'counter':
        return this.validateCounter(circuit);
      // Thêm các loại mạch khác ở đây
      default:
        return {
          isValid: false,
          feedback: 'Loại mạch không được hỗ trợ'
        };
    }
  }
}