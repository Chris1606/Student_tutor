import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, Bot, Search, ChevronLeft, Filter, 
  SlidersHorizontal, Clock, User, Sparkles, Calendar,
  Bookmark, RotateCcw, Book, Send, Plus, MessageSquare, SendHorizontal
} from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ChatInterface from './ChatInterface';
import { AVAILABLE_MODELS } from '@/api/openrouter';
import StudentMessage from './StudentMessage';
import TypingIndicator from './TypingIndicator';
import CloneAITutor from './CloneAITutor';
import AITutorManager from './AITutorManager';
import StudentList, { EXTENDED_MOCK_STUDENTS } from './StudentList';
import StudentChat from './StudentChat';
import AIChat from './AIChat';

interface Student {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  course: string;
  courseId: string;
  unread: number;
  online: boolean;
  needsResponse?: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: 'student' | 'tutor' | 'ai';
  senderName: string;
  senderAvatar: string;
}

// Sử dụng dữ liệu sinh viên mở rộng
const MOCK_STUDENTS = EXTENDED_MOCK_STUDENTS;

// Tạo mảng chứa tin nhắn riêng cho từng sinh viên, phân theo ID sinh viên
const STUDENT_MESSAGES: Record<string, ChatMessage[]> = {
  // Student ID 1 - Nguyen Van A - Digital Logic (course1)
  '1': [
    {
      id: '1',
      content: 'Hello, I am having trouble with the JK Flip-Flop calculation in the state table',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '2',
      content: 'Hello, JK Flip-Flop is a type of flip-flop with a special state table. What is the specific problem you are having?',
      timestamp: new Date(Date.now() - 3540000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '3',
      content: "I don't understand why the state toggles when J=K=1. How do I calculate the next state?",
      timestamp: new Date(Date.now() - 3480000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '4',
      content: "That's the characteristic of JK Flip-Flop. When J=K=1, the FF will toggle to the opposite state:\n\n- If Q(t) = 0, then Q(t+1) = 1\n- If Q(t) = 1, then Q(t+1) = 0\n\nTo calculate the next state, use the formula: Q(t+1) = J·Q̅(t) + K̅·Q(t)",
      timestamp: new Date(Date.now() - 3420000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '5',
      content: "I understand now. Can we create a JK Flip-Flop using NAND gates?",
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '6',
      content: "Yes, you can create a JK Flip-Flop using NAND gates. In fact, you can create a JK Flip-Flop from an SR Flip-Flop by adding a feedback circuit from the output Q and Q̅ back to the input.",
      timestamp: new Date(Date.now() - 2940000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '7',
      content: "That's interesting! How exactly would the feedback circuit work? Can you provide more details about the connections?",
      timestamp: new Date(Date.now() - 2880000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '8',
      content: "Sure. To create a JK flip-flop using NAND gates, you need to modify the SR flip-flop by adding feedback connections:\n\n1. Start with a basic SR NAND latch\n2. Add two additional NAND gates for input conditioning\n3. Connect J input to one NAND gate along with the inverted output Q̅\n4. Connect K input to the other NAND gate along with the output Q\n5. The outputs of these NAND gates become the S and R inputs to the basic latch\n\nThis feedback configuration ensures that when J=K=1, the circuit will toggle between states.",
      timestamp: new Date(Date.now() - 2820000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '9',
      content: "I see now. So the feedback provides the memory of the previous state, which is needed for the toggle operation. What about race conditions in JK flip-flops?",
      timestamp: new Date(Date.now() - 2760000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '10',
      content: "Excellent question! Race conditions are a significant concern with the basic JK flip-flop implementation. The issue occurs when J=K=1 and the flip-flop is supposed to toggle. If the propagation delay is too short, it might lead to continuous toggling (oscillation) rather than a single toggle per clock cycle.\n\nTo solve this problem, engineers developed the Master-Slave JK flip-flop or the edge-triggered JK flip-flop. The Master-Slave configuration uses two flip-flops in series, with the second one (slave) changing state only when the clock transitions from high to low, after the master has already stabilized.",
      timestamp: new Date(Date.now() - 2700000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '11',
      content: "That makes sense. For my assignment, I need to create a 4-bit synchronous counter using JK flip-flops. How would I approach this?",
      timestamp: new Date(Date.now() - 2640000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '12',
      content: "For a 4-bit synchronous counter using JK flip-flops, follow these steps:\n\n1. You'll need 4 JK flip-flops, one for each bit (Q0, Q1, Q2, Q3)\n2. Connect all clock inputs together so they trigger simultaneously\n3. For the least significant bit (Q0), set J0=K0=1 to make it toggle on every clock pulse\n4. For Q1, connect J1=K1=Q0 (this makes Q1 toggle only when Q0 is 1)\n5. For Q2, set J2=K2=Q0·Q1 (Q2 toggles when both Q0 and Q1 are 1)\n6. For Q3, set J3=K3=Q0·Q1·Q2 (Q3 toggles when Q0, Q1, and Q2 are all 1)\n\nThis configuration will count from 0000 to 1111 in binary with each clock pulse, creating a modulo-16 counter.",
      timestamp: new Date(Date.now() - 2580000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '13',
      content: "That's very helpful! If I wanted to create a down counter instead, would I just invert the J and K inputs?",
      timestamp: new Date(Date.now() - 2520000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '14',
      content: "For a down counter, you would need to modify the connections, but not simply by inverting J and K. Here's how to create a 4-bit down counter:\n\n1. Keep J0=K0=1 for the LSB to toggle with every clock pulse\n2. For Q1, set J1=K1=Q0̅ (the complement of Q0)\n3. For Q2, set J2=K2=Q0̅·Q1̅\n4. For Q3, set J3=K3=Q0̅·Q1̅·Q2̅\n\nThis configuration makes the counter decrement with each clock pulse, counting from 1111 down to 0000.\n\nIf you want a more flexible solution, you could also add a direction control input that determines whether to count up or down by using multiplexers to select between the up-count and down-count input connections for each flip-flop.",
      timestamp: new Date(Date.now() - 2460000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '15',
      content: "I think I understand the concept now. For our lab assignment, we also need to implement a BCD counter (0-9) using JK flip-flops. How would this differ from the standard 4-bit counter?",
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '16',
      content: "A BCD counter (0-9) is similar to a 4-bit binary counter, but it resets after counting to 9 (1001) instead of continuing to 15 (1111). Here's how to implement it:\n\n1. Use 4 JK flip-flops as before (Q0, Q1, Q2, Q3)\n2. For Q0, set J0=K0=1 to toggle on every clock pulse\n3. For Q1, connect J1=K1=Q0 (as in the normal binary counter)\n4. For Q2, set J2=K2=Q0·Q1 (same as normal counter)\n5. For Q3, set J3=Q0·Q2 and K3=1\n\nThe key difference is that you need additional logic to reset the counter to 0000 when it reaches 1010 (which would be 10 in decimal). This is done by:\n\n1. Add a NAND gate that detects when count = 1010 (by connecting inputs to Q1 and Q3)\n2. Use the output of this NAND gate to reset all flip-flops\n\nWith this modification, your counter will count from 0000 to 1001 (0-9) and then reset to 0000, behaving as a proper BCD counter.",
      timestamp: new Date(Date.now() - 2340000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '17',
      content: "Thank you so much for the detailed explanations! This helps me understand both the theoretical concepts and practical implementations. I'll try to design these circuits in our next lab session.",
      timestamp: new Date(Date.now() - 2280000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '18',
      content: "You're welcome! I'm glad I could help. Feel free to share your circuit designs after the lab, and I'd be happy to provide feedback. Don't hesitate to ask if you encounter any issues or have more questions about JK flip-flops or any other digital logic concepts.",
      timestamp: new Date(Date.now() - 2220000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '19',
      content: "Professor, one more question before the lab - are there any common mistakes or pitfalls I should watch out for when implementing these JK flip-flop circuits?",
      timestamp: new Date(Date.now() - 2160000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '20',
      content: "Excellent question! Here are some common pitfalls to avoid when working with JK flip-flop circuits:\n\n1. **Clock skew**: Ensure all flip-flops receive the clock signal at approximately the same time. Significant differences in clock arrival times can cause unpredictable behavior.\n\n2. **Proper power and ground connections**: Always verify that all ICs have proper power and ground connections before testing.\n\n3. **Unused inputs**: Never leave JK inputs floating. Connect unused J or K inputs to VCC or GND as appropriate (typically, unused J should be connected to GND and unused K to VCC to prevent unwanted toggling).\n\n4. **Debouncing**: When using manual clock inputs (like pushbuttons), implement debouncing to prevent multiple triggers from a single press.\n\n5. **Timing issues**: Be aware of propagation delays, especially in cascaded circuits. Sometimes adding small delays can help stabilize the circuit.\n\n6. **Fan-out limitations**: Don't exceed the fan-out specifications of your ICs. If driving multiple inputs, consider using buffers.\n\n7. **Noise sensitivity**: Digital circuits can be sensitive to noise. Use bypass capacitors (0.1μF) near the power pins of each IC.\n\n8. **Reset conditions**: Always define and test reset conditions to ensure the counter starts in a known state.\n\nKeeping these points in mind should help you avoid the most common issues when implementing your circuits.",
      timestamp: new Date(Date.now() - 2100000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '21',
      content: "This is extremely valuable information! I'll make sure to check all these points during our lab work. I'm really looking forward to implementing these circuits now that I have a clearer understanding.",
      timestamp: new Date(Date.now() - 2040000).toISOString(),
      sender: 'student',
      senderName: 'Nguyen Van A',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '22',
      content: "I'm glad you found it helpful! This proactive approach to anticipating potential issues will serve you well not just in this lab but throughout your engineering career. Good luck with your lab session, and don't hesitate to reach out if you need clarification on anything we've discussed.",
      timestamp: new Date(Date.now() - 1980000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    }
  ],
  
  // Student ID 2 - Tran Thi B - Digital Systems (course2)
  '2': [
    {
      id: '1',
      content: "I've just submitted my assignment on digital systems. I have a question about the conversion method.",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      sender: 'student',
      senderName: 'Tran Thi B',
      senderAvatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: '2',
      content: "I've received your assignment. What specific question do you have about the conversion method?",
      timestamp: new Date(Date.now() - 86300000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '3',
      content: "I want to ask about the conversion method from binary to BCD and vice versa. I find it a bit confusing in this part.",
      timestamp: new Date(Date.now() - 86200000).toISOString(),
      sender: 'student',
      senderName: 'Tran Thi B',
      senderAvatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: '4',
      content: "This is a good question. To convert binary to BCD, follow these steps:\n\n1. Divide the binary number into groups of 4 bits from right to left\n2. For each group of 4 bits, if the value is greater than 9 (1001), adjust it\n3. BCD only represents each decimal digit (0-9) with 4 bits",
      timestamp: new Date(Date.now() - 86100000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '5',
      content: "Yes, I understand. For example, if you have the BCD number 0011 0111, it represents the decimal number 37, and if you convert it to normal binary, it will be 100101, right?",
      timestamp: new Date(Date.now() - 86000000).toISOString(),
      sender: 'student',
      senderName: 'Tran Thi B',
      senderAvatar: 'https://i.pravatar.cc/150?img=2',
    }
  ],
  
  // Student ID 5 - Vu Minh E - Digital Logic (course1)
  '5': [
    {
      id: '1',
      content: "I'm having trouble with the 4-bit adder circuit. I don't understand how to handle the carry out.",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      sender: 'student',
      senderName: 'Vu Minh E',
      senderAvatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: '2',
      content: "The 4-bit adder circuit is essentially a combination of 4 1-bit adders (full adders). What is the problem you are having?",
      timestamp: new Date(Date.now() - 10700000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '3',
      content: "I don't understand how to handle the carry from the lower bit to the higher bit, and if the result exceeds 4 bits, what should I do?",
      timestamp: new Date(Date.now() - 10600000).toISOString(),
      sender: 'student',
      senderName: 'Vu Minh E',
      senderAvatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: '4',
      content: "To handle the carry between bits, connect the carry out of each full adder to the carry in of the next full adder.",
      timestamp: new Date(Date.now() - 10500000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '5',
      content: "I understand. To design the 4-bit adder circuit, you need to connect 4 full adders, is that right?",
      timestamp: new Date(Date.now() - 10400000).toISOString(),
      sender: 'student',
      senderName: 'Vũ Minh E',
      senderAvatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: '6',
      content: "Yes, I understand. You have correctly grasped the principle of the 4-bit adder circuit. The design of the 4-bit adder circuit from these full adders is called a ripple carry adder.",
      timestamp: new Date(Date.now() - 10300000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    }
  ],
  
  // Student ID 7 - Truong Van G - FPGA (course3)
  '7': [
    {
      id: '1',
      content: "I'm having trouble with the Verilog code for FPGA programming. Can you help me with the code?",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      sender: 'student',
      senderName: 'Truong Van G',
      senderAvatar: 'https://i.pravatar.cc/150?img=7',
    },
    {
      id: '2',
      content: "Hello, I have reviewed your Verilog code. There are a few issues that need to be adjusted: In Verilog, the assignment value in the `always` block should use the `<=` (non-blocking assignment) operator instead of `=` (blocking assignment) to avoid timing issues.",
      timestamp: new Date(Date.now() - 86300000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '3',
      content: "Thank you, I understand. So when should I use blocking (`=`) and when should I use non-blocking (`<=`)?",
      timestamp: new Date(Date.now() - 86200000).toISOString(),
      sender: 'student',
      senderName: 'Truong Van G',
      senderAvatar: 'https://i.pravatar.cc/150?img=7',
    },
    {
      id: '4',
      content: "That's a great question! The basic principle is: In sequential circuits use non-blocking (<=), and in combinational circuits use blocking (=).",
      timestamp: new Date(Date.now() - 86100000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    }
  ],
  
  // Student ID 26 - Ethan Nguyen
  'student26': [
    {
      id: '1',
      content: "Hello Professor, I'm having trouble understanding the concept of metastability in flip-flops. Could you explain it to me?",
      timestamp: new Date(Date.now() - 5400000).toISOString(),
      sender: 'student',
      senderName: 'Ethan Nguyen',
      senderAvatar: 'https://i.pravatar.cc/150?img=26',
    },
    {
      id: '2',
      content: "Hi Ethan, metastability is an important concept in digital design. It refers to a condition where a flip-flop's output is unstable and may oscillate or settle to an unpredictable state. This typically occurs when input signals change too close to the clock edge, violating setup or hold time requirements. What specific aspects are confusing you?",
      timestamp: new Date(Date.now() - 5340000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '3',
      content: "Thanks for explaining. I'm confused about why metastability happens at a physical level. Is it related to the transistor behavior? And how do we calculate the probability of metastability occurring in a system?",
      timestamp: new Date(Date.now() - 5280000).toISOString(),
      sender: 'student',
      senderName: 'Ethan Nguyen',
      senderAvatar: 'https://i.pravatar.cc/150?img=26',
    },
    {
      id: '4',
      content: "Excellent questions! At the physical level, metastability is indeed related to transistor behavior. Flip-flops are essentially bistable elements made of cross-coupled gates (usually NAND or NOR gates). These have two stable states (0 or 1), but there's also an unstable equilibrium point between them.\n\nWhen input data changes very close to the clock edge, the internal transistors don't have enough time to drive the circuit fully to one state or the other. The circuit can get 'stuck' near this equilibrium point for an unpredictable amount of time before eventually resolving to one of the stable states.\n\nRegarding probability, the Mean Time Between Failures (MTBF) due to metastability can be calculated using this formula:\n\nMTBF = (e^(t/τ)) / (f_data × f_clock × T_0)\n\nWhere:\n- t is the time available for resolution (usually one clock period)\n- τ is the resolving time constant (a characteristic of the flip-flop)\n- f_data is the frequency of data transitions\n- f_clock is the clock frequency\n- T_0 is a technology-dependent constant\n\nThis shows that giving more time for resolution (longer clock period) exponentially decreases the probability of metastability persisting.",
      timestamp: new Date(Date.now() - 5220000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '5',
      content: "That's fascinating! I think I understand better now. So if we have a system running at 100MHz (10ns clock period) and we find that our flip-flop has a τ of 0.5ns and T_0 of 10^-10 seconds, how would we calculate the MTBF, assuming data changes every clock cycle?",
      timestamp: new Date(Date.now() - 5160000).toISOString(),
      sender: 'student',
      senderName: 'Ethan Nguyen',
      senderAvatar: 'https://i.pravatar.cc/150?img=26',
    },
    {
      id: '6',
      content: "Let's work through this calculation:\n\nGiven:\n- t = 10ns (one clock period at 100MHz)\n- τ = 0.5ns (resolving time constant)\n- f_data = 100MHz (assuming data changes every clock cycle)\n- f_clock = 100MHz\n- T_0 = 10^-10 seconds\n\nMTBF = (e^(t/τ)) / (f_data × f_clock × T_0)\nMTBF = (e^(10/0.5)) / (10^8 × 10^8 × 10^-10)\nMTBF = e^20 / 10^6\nMTBF ≈ 4.85 × 10^8 / 10^6\nMTBF ≈ 4.85 × 10^2 seconds\nMTBF ≈ 485 seconds or about 8 minutes\n\nThis means that in this system, you could expect a metastability failure approximately every 8 minutes, which is actually quite frequent and concerning for most digital systems. This is why designers typically:\n\n1. Use multiple synchronizer stages (cascaded flip-flops) to increase the resolution time t\n2. Choose flip-flops with better metastability characteristics (lower τ)\n3. Reduce clock frequency when possible\n\nAdding just one more flip-flop stage would increase the resolution time to 20ns, making the MTBF approximately e^40 / 10^6 seconds, which is astronomically large and essentially eliminates the concern.",
      timestamp: new Date(Date.now() - 5100000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '7',
      content: "I see why synchronizers are so important now! So if I'm designing a circuit where signals cross clock domains (like from a 50MHz clock to a 100MHz clock), I should always use at least two flip-flops in series as synchronizers, right?",
      timestamp: new Date(Date.now() - 5040000).toISOString(),
      sender: 'student',
      senderName: 'Ethan Nguyen',
      senderAvatar: 'https://i.pravatar.cc/150?img=26',
    },
    {
      id: '8',
      content: "Exactly! When crossing clock domains, you should always use synchronizers, and a minimum of two flip-flops in series is the standard practice. Here's why:\n\n1. The first flip-flop might go metastable when capturing the asynchronous input\n2. The second flip-flop provides additional time for the first flip-flop to resolve its metastable state\n3. By the time the clock reaches the second flip-flop, the output of the first one has usually stabilized\n\nFor most commercial applications, two flip-flops are sufficient. For critical systems (medical, aerospace, etc.), designers sometimes use three or more stages to further reduce the probability of failure.\n\nAlso remember that synchronizers add latency (at least one clock cycle), and they can't handle high-speed data streams where multiple bits might change within one clock cycle. For high-speed cross-domain transfers, you might need more complex solutions like FIFOs or handshaking protocols.",
      timestamp: new Date(Date.now() - 4980000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '9',
      content: "This is really helpful! I have one more question - are there specific flip-flop designs or technologies that have better metastability characteristics than others? Like, would a D flip-flop be better than a JK flip-flop for synchronizers?",
      timestamp: new Date(Date.now() - 4920000).toISOString(),
      sender: 'student',
      senderName: 'Ethan Nguyen',
      senderAvatar: 'https://i.pravatar.cc/150?img=26',
    },
    {
      id: '10',
      content: "That's a great question about flip-flop selection. D flip-flops are indeed the standard choice for synchronizers, but not because of inherently better metastability characteristics compared to JK flip-flops. Rather, it's because:\n\n1. D flip-flops are simpler and have a well-defined behavior (output equals input at clock edge)\n2. For a synchronizer, you want straightforward data capture without additional logic\n3. JK, T, and SR flip-flops introduce more complex behavior that isn't needed for synchronization\n\nRegarding technologies with better metastability characteristics:\n\n1. Modern FPGA vendors often provide special flip-flops optimized for synchronization with lower τ values\n2. These might be labeled as \"synchronizer flip-flops\" in the component libraries\n3. In ASIC design, you can specify flip-flops with better metastability performance\n4. Faster technology nodes (smaller transistors) generally have better metastability characteristics\n\nSome designers also use Schmitt triggers before the first flip-flop to improve noise immunity, although this doesn't directly address metastability.\n\nFor your design work, I'd recommend using standard D flip-flops in a two-stage configuration as a starting point, and then consulting the specific documentation for your target technology (FPGA or ASIC library) to see if they offer specialized elements for synchronization.",
      timestamp: new Date(Date.now() - 4860000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '11',
      content: "Thank you so much for the detailed explanations! This helps a lot with my understanding of metastability. I'm working on a project that involves communicating between different clock domains on an FPGA, so I'll definitely implement proper synchronizers with D flip-flops. Is there any recommended reading or resources where I can learn more about this topic?",
      timestamp: new Date(Date.now() - 4800000).toISOString(),
      sender: 'student',
      senderName: 'Ethan Nguyen',
      senderAvatar: 'https://i.pravatar.cc/150?img=26',
    },
    {
      id: '12',
      content: "You're welcome, Ethan! I'm glad this is helpful for your project. For additional resources on metastability and clock domain crossing, I recommend:\n\n1. **Books**:\n   - \"Digital Design and Computer Architecture\" by Harris & Harris has an excellent section on metastability\n   - \"Advanced Digital Design with the Verilog HDL\" by Michael Ciletti covers synchronization techniques\n\n2. **FPGA Vendor Documentation**:\n   - Xilinx has application notes like XAPP094 on metastability\n   - Intel (formerly Altera) has documents on metastability and synchronization \n\n3. **Academic Papers**:\n   - \"Synchronizer Design for Multi-Clock Domain SoCs\" by Dike & Burton\n   - \"Metastability and Synchronizers: A Tutorial\" by Ginosar\n\n4. **Online Resources**:\n   - ASIC World website has practical examples of synchronizer implementations\n   - Doulos has good tutorials on clock domain crossing\n\nFor your specific FPGA project, also look into:\n\n1. Using vendor-provided FIFO components for larger data transfers between clock domains\n2. Clock domain crossing verification tools or methodologies\n3. Timing constraints specific to synchronizer paths (sometimes called \"false paths\")\n\nDo you know which FPGA family you'll be using for your project?",
      timestamp: new Date(Date.now() - 4740000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '13',
      content: "I'll be using a Xilinx Artix-7 FPGA for this project. These resources are great - I'll definitely check them out! One last question: could you explain the concept of metastability when viewing it from the timing diagram perspective? I think that would really cement my understanding.",
      timestamp: new Date(Date.now() - 4680000).toISOString(),
      sender: 'student',
      senderName: 'Ethan Nguyen',
      senderAvatar: 'https://i.pravatar.cc/150?img=26',
    },
    {
      id: '14',
      content: "From a timing diagram perspective, metastability can be visualized as follows:\n\n1. **Normal Operation (No Metastability)**:\n   - Data input is stable well before the clock edge (meeting setup time)\n   - Data remains stable after the clock edge (meeting hold time)\n   - Output changes cleanly to the new state shortly after the clock edge\n\n2. **Metastability Scenario**:\n   - Data changes very close to the clock edge (violating setup/hold time)\n   - Instead of a clean transition, the output enters an intermediate voltage level\n   - The output might oscillate or remain at this intermediate level for an unpredictable time\n   - Eventually, the output resolves to either high or low, but this could take longer than expected\n\nIn a timing diagram, you would see:\n   - Clock signal: Clean periodic pulses\n   - Data input: Changing at an unfortunate moment near clock edge\n   - Output (metastable): Instead of a sharp transition, it would show a \"fuzzy\" region or oscillation\n   - This fuzzy region extends for some time before finally settling\n\nThe Artix-7 is an excellent choice and actually has good metastability characteristics. Xilinx provides specific guidance for clock domain crossing in their documentation. Look for their \"Synchronization Circuits\" application notes, which include timing diagrams that visualize these concepts more clearly.\n\nIf you're implementing this in your Artix-7 design, make sure to also properly constrain your design with appropriate timing constraints, and consider using Xilinx's CDC analysis tools to verify your synchronization circuits.",
      timestamp: new Date(Date.now() - 4620000).toISOString(),
      sender: 'tutor',
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '15',
      content: "Could you explain the concept of metastability in flip-flops? I'm working on cross-domain clock designs and need to understand it better.",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      sender: 'student',
      senderName: 'Ethan Nguyen',
      senderAvatar: 'https://i.pravatar.cc/150?img=26',
    }
  ]
};

// Data for AI suggestions
const MOCK_AI_SUGGESTIONS = [
  "How to teach binary counting circuits?",
  "Creating Karnaugh map exercises for students",
  "Effective methods for teaching JK Flip-Flop",
  "Explain NAND and NOR gates to new students"
];

// Data for AI chat history
const MOCK_AI_HISTORY = [
  {
    id: '1',
    title: 'Teaching logic circuits',
    timestamp: 'Today, 10:24'
  },
  {
    id: '2',
    title: 'Creating mid-term exams for microprocessor courses',
    timestamp: 'Yesterday'
  },
  {
    id: '3',
    title: 'Question about teaching methods',
    timestamp: '23/05/2023'
  }
];

// Export data for use in other components
export { MOCK_STUDENTS, STUDENT_MESSAGES, MOCK_AI_SUGGESTIONS, MOCK_AI_HISTORY };

interface TutorChatProps {
  studentId?: string;
  courseId: string;
}

const TutorChat: React.FC<TutorChatProps> = ({ studentId, courseId = "course1" }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'ai'>('student');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(studentId || null);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [aiTutorCloned, setAiTutorCloned] = useState(false);
  const [aiResponses, setAiResponses] = useState<Record<string, {
    message: string,
    timestamp: string
  }>>({});
  const [answeredStudents, setAnsweredStudents] = useState<string[]>([]);
  const [processingStudents, setProcessingStudents] = useState<string[]>([]);
  const [aiConversations, setAiConversations] = useState<Record<string, {
    studentMessage: string,
    aiResponse: string,
    timestamp: string
  }[]>>({});
  
  // Check screen size to change layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Override selectedStudent if studentId is provided in props
  useEffect(() => {
    if (studentId) {
      setSelectedStudent(studentId);
      console.log('Selected student from props:', studentId);
    }
  }, [studentId]);
  
  // Handle student selection
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudent(studentId);
    
    // Auto-close student list in mobile view
    if (isMobileView) {
      setShowChatList(false);
    }
  };
  
  // Handle clone complete
  const handleCloneComplete = (tutorId: string) => {
    setAiTutorCloned(true);
    console.log('AI Tutor cloned successfully:', tutorId);
    
    // Thêm câu trả lời cho Ethan Nguyen về metastability
    const ethanId = 'student26';
    const ethanQuestion = "Could you explain the concept of metastability in flip-flops? I'm working on cross-domain clock designs and need to understand it better.";
    const ethanResponse = "Metastability in flip-flops occurs when input signals violate setup/hold timing requirements, causing the output to enter an unstable state between logic levels. This is critical in cross-domain clock designs where signals cross between different clock domains. To prevent metastability failures, always use synchronizers with at least two D flip-flops in series, which exponentially reduces the probability of metastability persisting. For your cross-domain clock design, implement proper synchronization circuits and ensure adequate timing margins.";
    
    // Đánh dấu sinh viên đã được trả lời
    setAnsweredStudents(prev => {
      const newAnswered = [...prev];
      if (!newAnswered.includes(ethanId)) {
        newAnswered.push(ethanId);
      }
      console.log("Updated answered students:", [...newAnswered]);
      return newAnswered;
    });
    
    // Cập nhật câu trả lời AI
    setAiResponses(prev => {
      const newResponses = {
        ...prev,
        [ethanId]: {
          message: ethanResponse,
          timestamp: 'Just now'
        }
      };
      console.log("Updated AI responses:", newResponses);
      return newResponses;
    });
    
    // Cập nhật conversations
    const updatedConversations = {
      ...aiConversations,
      [ethanId]: [
        {
          studentMessage: ethanQuestion,
          aiResponse: ethanResponse,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    console.log("Setting AI conversations:", updatedConversations);
    setAiConversations(updatedConversations);
    
    // Gọi callback để đảm bảo thay đổi được truyền xuống components con
    handleConversationUpdate(updatedConversations);
    
    // Force update by setting selected student to Ethan (chỉ khi chưa chọn)
    if (selectedStudent !== ethanId) {
      setTimeout(() => {
        setSelectedStudent(ethanId);
        console.log("Selected Ethan for viewing response");
      }, 100);
    } else {
      // Cập nhật lại state nếu đã chọn để kích hoạt render
      setSelectedStudent(null);
      setTimeout(() => {
        setSelectedStudent(ethanId);
        console.log("Re-selected Ethan to trigger render");
      }, 50);
    }
  };
  
  // Handle conversation updates from StudentList
  const handleConversationUpdate = (conversations: Record<string, {studentMessage: string, aiResponse: string, timestamp: string}[]>) => {
    setAiConversations(conversations);
  };
  
  // Get all messages in course for AI tutor cloning
  const getAllCourseMessages = () => {
    // Get all students in this course
    const studentsInCourse = MOCK_STUDENTS.filter(s => s.courseId === courseId);
    
    // Collect all messages from these students
    let allMessages: ChatMessage[] = [];
    studentsInCourse.forEach(student => {
      if (STUDENT_MESSAGES[student.id]) {
        allMessages = [...allMessages, ...STUDENT_MESSAGES[student.id]];
      }
    });
    
    // Sort messages by timestamp
    allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return allMessages;
  };
  
  // Get course name from ID
  const getCourseName = (id: string) => {
    switch(id) {
      case 'course1': return 'Digital Logic';
      case 'course2': return 'Digital Systems';
      case 'course3': return 'FPGA & Verilog';
      default: return 'Course';
    }
  };
  
  console.log('TutorChat Props:', { studentId, courseId });

  return (
    <div className="flex flex-col h-full">
      <Tabs 
        defaultValue="student" 
        className="w-full h-full flex flex-col"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'student' | 'ai')}
      >
        <div className="border-b px-4 py-2 bg-white flex items-center justify-between sticky top-0 z-10">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="student" className="flex items-center gap-2 data-[state=active]:bg-tutu-50 data-[state=active]:text-tutu-800">
              <MessageCircle size={18} />
              <span>Chat with students</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2 data-[state=active]:bg-tutu-50 data-[state=active]:text-tutu-800">
              <Bot size={18} />
              <span>Ask AI</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-shrink-0 absolute right-4 top-2 z-20">
            <CloneAITutor 
              courseId={courseId} 
              courseName={getCourseName(courseId)}
              courseMessages={getAllCourseMessages()}
              onCloneComplete={handleCloneComplete}
            />
          </div>
        </div>
        
        <TabsContent value="student" className="flex-1 p-0 m-0 outline-none overflow-hidden">
          <div className="flex h-full overflow-hidden">
            {/* Student List */}
            {(showChatList || !isMobileView) && (
              <StudentList 
                courseId={courseId}
                selectedStudent={selectedStudent}
                onSelectStudent={handleSelectStudent}
                isMobileView={isMobileView}
                aiTutorCloned={aiTutorCloned}
                onConversationUpdate={handleConversationUpdate}
                aiResponses={aiResponses}
                answeredStudents={answeredStudents}
                processingStudents={processingStudents}
              />
            )}
            
            {/* Student Chat */}
            <StudentChat
              selectedStudent={selectedStudent}
              courseId={courseId}
              isMobileView={isMobileView}
              showChatList={showChatList}
              setShowChatList={setShowChatList}
              aiConversations={aiConversations}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="ai" className="flex-1 p-0 m-0 outline-none">
          <AIChat
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TutorChat;
