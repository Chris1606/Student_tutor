import axios, { AxiosError } from 'axios';

export interface PracticeQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  type: 'multiple-choice' | 'problem-solving' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  requiresDrawing?: boolean;
  circuitType?: 'counter' | 'decoder' | 'flipflop' | 'gate';
}

export interface GenerateQuestionsRequest {
  courseId: string;
  practiceType: string;
  difficultyLevel: string;
  numberOfQuestions?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Mock questions for development (remove in production)
const MOCK_QUESTIONS: PracticeQuestion[] = [
  {
    id: '1',
    question: 'What is the output of an AND gate when both inputs are 1?',
    options: ['0', '1', 'Undefined', 'Floating'],
    correctAnswer: '1',
    explanation: 'An AND gate outputs 1 (true) only when all inputs are 1 (true).',
    type: 'multiple-choice',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'Design a 4-bit binary counter using D flip-flops.',
    correctAnswer: 'Circuit diagram and explanation',
    explanation: 'A 4-bit counter requires 4 D flip-flops connected in series...',
    type: 'problem-solving',
    difficulty: 'medium'
  }
];

export const generatePracticeQuestions = async (params: GenerateQuestionsRequest): Promise<PracticeQuestion[]> => {
  try {
    // For development, return mock questions
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      return MOCK_QUESTIONS;
    }

    const response = await axios.post<PracticeQuestion[]>('/api/practice/generate', params);
    return response.data;
  } catch (error) {
    const apiError: ApiError = {
      message: 'Failed to generate practice questions',
      status: (error as AxiosError)?.response?.status
    };

    if (axios.isAxiosError(error)) {
      apiError.code = error.code;
      apiError.message = error.response?.data?.message || error.message;
    }

    console.error('Error generating practice questions:', apiError);
    throw apiError;
  }
};

export const submitPracticeAnswers = async (
  courseId: string, 
  questionId: string, 
  answer: string | number
): Promise<{ correct: boolean; explanation: string }> => {
  try {
    // For development, simulate answer checking
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const question = MOCK_QUESTIONS.find(q => q.id === questionId);
      return {
        correct: question?.correctAnswer === answer,
        explanation: question?.explanation || 'No explanation available'
      };
    }

    const response = await axios.post('/api/practice/submit', {
      courseId,
      questionId,
      answer
    });
    return response.data;
  } catch (error) {
    const apiError: ApiError = {
      message: 'Failed to submit practice answer',
      status: (error as AxiosError)?.response?.status
    };

    if (axios.isAxiosError(error)) {
      apiError.code = error.code;
      apiError.message = error.response?.data?.message || error.message;
    }

    console.error('Error submitting practice answer:', apiError);
    throw apiError;
  }
}; 