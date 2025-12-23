import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bot, SlidersHorizontal, Sparkles, Clock
} from 'lucide-react';
import ChatInterface from './ChatInterface';
import { MOCK_AI_SUGGESTIONS, MOCK_AI_HISTORY } from './TutorChat';

interface AIChatProps {
  selectedModel: any;
  setSelectedModel: (model: any) => void;
}

const AIChat: React.FC<AIChatProps> = ({ selectedModel, setSelectedModel }) => {
  const [showModelSelect, setShowModelSelect] = useState(false);

  return (
    <div className="flex h-full overflow-hidden">
      {/* AI Assistant Sidebar */}
      <div className="w-full md:w-80 border-r border-border overflow-y-auto bg-gray-50 flex flex-col">
        <div className="p-4 sticky top-0 bg-white z-10 border-b border-gray-200">
          <h3 className="font-semibold text-lg mb-3">AI Assistant</h3>
          
          {/* Model selector */}
          <div className="relative mb-3">
            <div 
              onClick={() => setShowModelSelect(!showModelSelect)}
              className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-tutu-600" />
                <span className="text-sm font-medium">{selectedModel.name}</span>
              </div>
              <SlidersHorizontal size={14} className="text-gray-500" />
            </div>
            
            {showModelSelect && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="p-2 max-h-64 overflow-y-auto">
                  {/* This would use AVAILABLE_MODELS from the parent component */}
                  <div 
                    className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => {
                      setSelectedModel(selectedModel);
                      setShowModelSelect(false);
                    }}
                  >
                    <div className="text-sm font-medium">{selectedModel.name}</div>
                    <div className="text-xs text-gray-500">{selectedModel.description}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* New Chat button */}
          <Button 
            variant="default" 
            className="w-full mb-3 bg-tutu-600 hover:bg-tutu-700 text-black"
          >
            <Sparkles size={16} className="mr-2" />
            New Chat
          </Button>
          
          {/* Question suggestions */}
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Suggestions</h4>
          <div className="space-y-2 mb-4">
            {MOCK_AI_SUGGESTIONS.map((suggestion, index) => (
              <div 
                key={index}
                className="p-2 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat history */}
        <div className="flex-1 overflow-y-auto p-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2 px-1">Chat History</h4>
          <div className="space-y-1">
            {MOCK_AI_HISTORY.map(item => (
              <div 
                key={item.id}
                className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{item.timestamp}</span>
                </div>
                <div className="text-sm mt-1 line-clamp-1">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI Information */}
        <div className="p-3 border-t border-gray-200">
          <div className="p-3 rounded-lg bg-tutu-50 border border-tutu-100">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={16} className="text-tutu-600" />
              <h4 className="text-sm font-medium text-tutu-700">AI Assistant Information</h4>
            </div>
            <p className="text-xs text-gray-600">
              AI Assistant is designed to support teaching about digital logic and digital systems. 
              You can ask questions about teaching methods, create materials, and more.
            </p>
          </div>
        </div>
      </div>
      
      {/* Chat interface */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-border flex items-center px-4 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-tutu-100 flex items-center justify-center">
              <Bot size={16} className="text-tutu-600" />
            </div>
            
            <div>
              <h3 className="font-medium text-sm">AI Assistant</h3>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">
                  {selectedModel.name}
                </span>
              </div>
            </div>
          </div>
        </div>
          
        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            selectedModel={selectedModel}
            tutorMode={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChat; 