import { toast } from "sonner";
import { OpenRouterRequestMessage, sendMessageToOpenRouter, streamMessageFromOpenRouter } from './openrouter';

// Định nghĩa kiểu tin nhắn
export interface ChatMessage {
  id: string;
  sender: 'student' | 'tutor' | 'ai' | 'system';
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  courseId?: string;
  studentId?: string;
  studentName?: string;
  messages: ChatMessage[];
}

// Chuyển đổi tin nhắn sang định dạng OpenRouter yêu cầu
export const formatMessagesForOpenRouter = (messages: ChatMessage[]): OpenRouterRequestMessage[] => {
  return messages.map(message => ({
    role: message.sender === 'ai' ? 'assistant' : message.sender === 'system' ? 'system' : 'user',
    content: message.content
  }));
};

// Tạo tin nhắn hệ thống dựa theo ngữ cảnh
export const createSystemMessage = (
  options: {
    courseName?: string;
    practiceMode?: boolean;
    realTutorMode?: boolean;
  } = {}
): OpenRouterRequestMessage => {
  const { courseName, practiceMode, realTutorMode } = options;
  
  let content = `You are ILLUMA, an AI teaching assistant specializing in electronics and digital circuits.`;
  
  if (courseName) {
    content += ` You are currently helping with the course: ${courseName}.`;
  }
  
  if (practiceMode) {
    content += ` You are in practice mode, where you should guide students through exercises and provide hints rather than direct answers.`;
  }
  
  if (realTutorMode) {
    content += ` You should inform the student that you are an AI assistant and a real tutor will join the conversation soon.`;
  }
  
  content += ` Always be helpful, clear, and provide step-by-step explanations when teaching concepts. 
  If asked about circuit designs, explain the principles and components clearly.`;
  
  return {
    role: 'system',
    content
  };
};

// Lấy phản hồi từ AI
export const getAIResponse = async (
  messages: ChatMessage[],
  modelId: string,
  options: {
    courseName?: string;
    practiceMode?: boolean;
    realTutorMode?: boolean;
    onChunk?: (chunk: string) => void;
  } = {}
): Promise<string> => {
  try {
    const systemMessage = createSystemMessage(options);
    const historyMessages = formatMessagesForOpenRouter(messages);
    
    const apiMessages = [systemMessage, ...historyMessages];
    
    // Sử dụng stream nếu có callback onChunk
    if (options.onChunk) {
      return await streamMessageFromOpenRouter(
        apiMessages,
        modelId,
        options.onChunk
      );
    } else {
      // Không sử dụng stream
      const response = await sendMessageToOpenRouter(apiMessages, modelId);
      return response.choices[0].message.content;
    }
  } catch (error: any) {
    console.error('Error getting AI response:', error);
    toast.error(error.message || 'Không thể kết nối với AI tutor');
    throw error;
  }
};

// Lưu trữ tin nhắn trong localStorage
export const saveChatSession = (session: ChatSession): void => {
  try {
    const sessions = getAllSavedSessions();
    const existingSessionIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingSessionIndex >= 0) {
      // Cập nhật phiên hiện có
      sessions[existingSessionIndex] = session;
    } else {
      // Thêm phiên mới
      sessions.unshift(session);
    }
    
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
};

// Lấy tất cả phiên chat từ localStorage
export const getAllSavedSessions = (): ChatSession[] => {
  try {
    const sessionsData = localStorage.getItem('chat_sessions');
    return sessionsData ? JSON.parse(sessionsData) : [];
  } catch (error) {
    console.error('Error retrieving chat sessions:', error);
    return [];
  }
};

// Lấy phiên chat theo ID
export const getSavedSessionById = (sessionId: string): ChatSession | null => {
  try {
    const sessions = getAllSavedSessions();
    return sessions.find(session => session.id === sessionId) || null;
  } catch (error) {
    console.error('Error retrieving chat session:', error);
    return null;
  }
};

// Xóa phiên chat
export const deleteChatSession = (sessionId: string): void => {
  try {
    const sessions = getAllSavedSessions();
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    localStorage.setItem('chat_sessions', JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Error deleting chat session:', error);
  }
};

// Tạo một phiên chat mới
export const createNewChatSession = (modelName?: string): ChatSession => {
  const initialMessage: ChatMessage = {
    id: '1',
    sender: 'ai',
    senderName: modelName || 'ILLUMA',
    senderAvatar: '/placeholder.svg',
    content: `Xin chào! Tôi là ${modelName || 'ILLUMA'}. Tôi có thể giúp gì cho bạn hôm nay?`,
    timestamp: new Date().toISOString()
  };
  
  const session: ChatSession = {
    id: Date.now().toString(),
    title: 'Cuộc trò chuyện mới',
    createdAt: new Date().toISOString(),
    messages: [initialMessage]
  };
  
  // Lưu phiên mới vào localStorage
  saveChatSession(session);
  
  return session;
}; 