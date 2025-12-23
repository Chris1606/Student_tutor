import { Book, Calculator, Binary, CircuitBoard, Search, Wrench } from 'lucide-react';

export const ExerciseTypes = [
  {
    id: 'theory',
    name: 'Theory',
    description: 'Learn fundamental concepts of digital electronics, Boolean algebra, and logic gates',
    icon: Book,
    examples: ['Basic logic gates', 'Boolean algebra laws', 'Digital number systems']
  },
  {
    id: 'calculation',
    name: 'Basic Calculations',
    description: 'Practice binary conversions and arithmetic operations',
    icon: Calculator,
    examples: ['Binary to decimal conversion', 'Binary addition/subtraction', 'Hexadecimal operations']
  },
  {
    id: 'minimization',
    name: 'Function Minimization',
    description: 'Learn to minimize Boolean functions and prove theorems',
    icon: Binary,
    examples: ['Karnaugh maps', 'Boolean function simplification', 'Logic optimization']
  },
  {
    id: 'implementation',
    name: 'Circuit Implementation',
    description: 'Convert Boolean functions into digital circuits',
    icon: CircuitBoard,
    examples: ['Gate-level implementation', 'Combinational circuits', 'Sequential circuits']
  },
  {
    id: 'analysis',
    name: 'Circuit Analysis',
    description: 'Analyze and understand the behavior of digital circuits',
    icon: Search,
    examples: ['Timing diagrams', 'State analysis', 'Circuit behavior']
  },
  {
    id: 'design',
    name: 'Circuit Design',
    description: 'Design digital circuits to meet specific requirements',
    icon: Wrench,
    examples: ['Counter design', 'State machine design', 'Memory systems']
  }
];

export const DifficultyLevels = [
  { 
    id: 'easy', 
    name: 'Easy', 
    description: 'Basic concepts and simple calculations',
    recommendedFor: 'Beginners learning digital electronics',
    timeLimit: 60, // seconds per question
    questionsCount: 5
  },
  { 
    id: 'medium', 
    name: 'Medium', 
    description: 'More complex problems and circuit analysis',
    recommendedFor: 'Students with basic understanding',
    timeLimit: 90,
    questionsCount: 7
  },
  { 
    id: 'hard', 
    name: 'Hard', 
    description: 'Advanced design challenges and optimization',
    recommendedFor: 'Advanced students and professionals',
    timeLimit: 120,
    questionsCount: 10
  }
];

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  selectedAnswer?: string;
  isAnswered?: boolean;
  timeLimit: number;
  type: 'multiple-choice' | 'problem-solving' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  attempts?: number;
  hints?: string[];
}

export const pageTransition = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
  transition: { type: "spring", stiffness: 100, damping: 20 }
}; 