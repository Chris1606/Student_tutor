import { toast } from 'sonner';

export interface OpenRouterRequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterRequestBody {
  messages: OpenRouterRequestMessage[];
  model: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface OpenRouterResponseChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
  index: number;
}

export interface OpenRouterResponse {
  id: string;
  choices: OpenRouterResponseChoice[];
  created: number;
  model: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Gửi yêu cầu đến OpenRouter API
 * @param messages Mảng các tin nhắn trong cuộc trò chuyện
 * @param modelId ID của model AI muốn sử dụng
 * @returns Promise với phản hồi từ API
 */
export const sendMessageToOpenRouter = async (
  messages: OpenRouterRequestMessage[],
  modelId: string = 'anthropic/claude-3-opus'
): Promise<OpenRouterResponse> => {
  try {
    // Điều chỉnh cách đọc API key để dễ debug
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    console.log("API key available in non-stream mode:", !!apiKey);
    
    // Nếu không có API key từ env, sử dụng giá trị mặc định để test
    const actualApiKey = apiKey || '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';
    
    if (!actualApiKey) {
      throw new Error('OpenRouter API key is missing');
    }
    
    const requestBody: OpenRouterRequestBody = {
      messages,
      model: modelId,
      temperature: 0.7,
      max_tokens: 4000
    };
    
    console.log("Sending non-stream request to OpenRouter with model:", modelId);
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${actualApiKey}`,
        'HTTP-Referer': 'https://illuma.edu.vn',
        'X-Title': 'ILLUMA AI Tutor'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from AI');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error calling OpenRouter API:', error);
    toast.error(error.message || 'Failed to get response from AI');
    throw error;
  }
};

/**
 * Gửi tin nhắn đến OpenRouter API với streaming
 * @param messages Mảng các tin nhắn trong cuộc trò chuyện
 * @param modelId ID của model AI muốn sử dụng
 * @param onChunk Callback xử lý từng phần phản hồi streaming
 * @returns Promise với phản hồi đầy đủ
 */
export const streamMessageFromOpenRouter = async (
  messages: OpenRouterRequestMessage[],
  modelId: string = 'anthropic/claude-3-opus',
  onChunk: (chunk: string) => void
): Promise<string> => {
  try {
    // Điều chỉnh cách đọc API key để dễ debug
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    console.log("API key available:", !!apiKey); // Log xem có API key không
    
    // Nếu không có API key từ env, sử dụng giá trị mặc định để test
    const actualApiKey = apiKey;
    
    if (!actualApiKey) {
      throw new Error('OpenRouter API key is missing');
    }
    
    const requestBody: OpenRouterRequestBody = {
      messages,
      model: modelId,
      temperature: 0.7,
      max_tokens: 4000,
      stream: true
    };
    
    console.log("Sending request to OpenRouter with model:", modelId);
    console.log("Request messages:", JSON.stringify(messages, null, 2));
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${actualApiKey}`,
        'HTTP-Referer': 'https://illuma.edu.vn',
        'X-Title': 'ILLUMA AI Tutor'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from AI');
    }
    
    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        console.log("Raw chunk received:", chunk);
        
        const lines = chunk
          .split('\n')
          .filter(line => line.trim() !== '' && line.trim() !== 'data: [DONE]');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6); // Remove 'data: ' prefix
              console.log("Parsing JSON:", jsonStr);
              
              // Skip empty data
              if (jsonStr.trim() === '') continue;
              
              const json = JSON.parse(jsonStr);
              
              // Log entire parsed JSON to see structure
              console.log("Parsed JSON:", json);
              
              // Handle different streaming formats (OpenRouter/OpenAI have differences)
              // OpenAI format - uses delta.content
              if (json.choices && json.choices[0]?.delta?.content) {
                const content = json.choices[0].delta.content;
                console.log("Content received (delta format):", content);
                fullResponse += content;
                onChunk(content);
              } 
              // OpenRouter may send in complete message format in some cases
              else if (json.choices && json.choices[0]?.message?.content) {
                const content = json.choices[0].message.content;
                console.log("Content received (message format):", content);
                fullResponse += content;
                onChunk(content);
              }
              // Some models might use text field directly
              else if (json.choices && json.choices[0]?.text) {
                const content = json.choices[0].text;
                console.log("Content received (text format):", content);
                fullResponse += content;
                onChunk(content);
              }
            } catch (e) {
              console.error('Error parsing JSON from stream:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading stream:', error);
      reader.cancel();
      throw error;
    }
    
    return fullResponse;
  } catch (error: any) {
    console.error('Error streaming from OpenRouter API:', error);
    toast.error(error.message || 'Failed to stream response from AI');
    throw error;
  }
};

/**
 * Danh sách các model AI có sẵn từ OpenRouter
 */
export const AVAILABLE_MODELS = [
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic\'s most powerful model, best at complex tasks'
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced model for most tasks'
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and cost-effective for simpler tasks'
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI\'s latest and most capable model'
  },
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Powerful model for instruction following and coding'
  },
  {
    id: 'google/gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Google\'s multimodal large language model'
  },
  {
    id: 'mistralai/mixtral-8x7b',
    name: 'Mixtral 8x7B',
    description: 'Powerful open-source mixture of experts model'
  }
]; 