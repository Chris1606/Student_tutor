interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const getAIResponse = async (
  question: string,
  context: {
    currentTopic?: string;
    difficulty?: string;
    type?: string;
    circuitType?: string;
    previousMessages: { role: 'user' | 'assistant'; content: string }[];
  }
) => {
  // Sử dụng API key từ biến môi trường Vite
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || 'default_test_key';
  
  // Kiểm tra API key
  if (!API_KEY || API_KEY === 'default_test_key') {
    throw new Error('OpenRouter API key chưa được cấu hình. Vui lòng kiểm tra file .env của bạn.');
  }

  const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

        let systemPrompt = `You are a helpful AI designed to solve Karnaugh map (K-map) problems step by step with clear explanations. Here are the steps to solve a K-map problem:
        
      1. *Build the K-map table*: Based on the number of variables (e.g., 2, 3, or 4 variables), create a K-map grid with rows and columns arranged in Gray code order. Gray code ensures that two adjacent cells differ by only one bit.
      2. *Fill in values in the K-map*: Place a '1' for minterms (values where the logic function equals 1), '0' for maxterms (values where the logic function equals 0), and 'x' for don't-care conditions (which can be either 0 or 1, as desired).
      3. *Group the cells*: Group the cells with a value of '1' (and optionally include 'x' if it helps) into the largest possible groups, with the number of cells in each group being a power of 2 (1, 2, 4, 8, etc.).
      4. *Simplify the expression*: From each group, identify the unchanged variables in that group and create product terms to form the simplified logical expression.

      ### Explanation of terms:
      - *Minterm (Σ m)*: These are the input values where the logic function returns 1. For example, m(0) means that the input (a,b,c) = (0,0,0) results in 1.
      - *Maxterm*: These are the input values where the logic function returns 0 (they do not appear in Σ m).
      - *Don't-care (Σ d)*: These are input values where the logic function is not concerned with the result (it can be 0 or 1), represented by 'x' in the K-map.
      - *Gray Code*: A binary ordering in which two adjacent values differ by only one bit, e.g., 00 → 01 → 11 → 10.

      ### Few-shot Examples:
      #### Example 1: Simplify \\( f(a,b,c) = Σ m(0,1,2) + Σ d(3) \\)
      - *Step 1*: With 3 variables, the K-map has 2 rows (\\(a = 0, 1\\)) and 4 columns (\\(bc = 00, 01, 11, 10\\)) in Gray code order.
      - *Step 2*: Place 1 in cells m(0), m(1), m(2), 'x' in m(3), and 0 in the remaining cells.
      - *Step 3*: Group (0,1,2,3) into a 4-cell group.
      - *Step 4*: The simplified expression is: \\( f(a,b,c) = a' \\).

      #### Example 2: Simplify \\( f(a,b,c,d) = Σ m(1,9,10,12,14,15) + Σ d(0) \\)
      - *Step 1*: With 4 variables, the K-map has 4 rows (\\(ab = 00, 01, 11, 10\\)) and 4 columns (\\(cd = 00, 01, 11, 10\\)) in Gray code order.
      - *Step 2*: Place 1 in cells m(1,9,10,12,14,15), 'x' in m(0), and 0 in all other cells.
      - *Step 3*: Group the cells into the following groups:
        * Group 1: (1,9) → term1
        * Group 2: (10,14) → term2
        * Group 3: (12,14) → term3
        * Group 4: (15,14) → term4
      - *Step 4*: The simplified expression is: \\( f(a,b,c,d) = b'c'd + acd' + abd' + abc \\)
      ###Language: English for all responses`;
      
  if (context.type === 'multiple-choice') {
    systemPrompt += `\nThis is a multiple-choice question. Please analyze each option and explain why it is correct or incorrect.`;
  } else if (context.circuitType === 'counter') {
    systemPrompt += `\nThis is a problem about designing a counter. Please guide through the design, drawing, and explaining the principles of operation of the circuit.`;
  }

  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    ...context.previousMessages,
    {
      role: 'user',
      content: question
    }
  ];

  try {
    console.log('Sending request to OpenRouter API with key:', API_KEY);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Coinstructor Platform'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.7-sonnet',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`API request failed with status ${response.status}`);
      }
    }

    const data: OpenRouterResponse = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error details:', error);
    
    // Trả về lỗi cụ thể để hiển thị cho người dùng
    if (error instanceof Error) {
      throw new Error(`AI Assistant Error: ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}; 