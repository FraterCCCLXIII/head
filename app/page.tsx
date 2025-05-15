"use client";

import { useState, useEffect } from "react";
import Chat from "@/src/components/Chat";
import SVGHead from "@/src/components/SVGHead";
import LLMConfigComponent from "@/src/components/LLMConfig";
import { LLMConfig, sendMessageToLLM } from "@/src/utils/llmClient";

export default function Home() {
  const [speaking, setSpeaking] = useState(false);
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'>('neutral');
  const [showConfig, setShowConfig] = useState(false);
  const [llmConfig, setLLMConfig] = useState<LLMConfig | null>(null);
  const [conversationHistory, setConversationHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);

  // Function to handle LLM configuration
  const handleSaveConfig = (config: LLMConfig) => {
    setLLMConfig(config);
    setIsConfigured(true);
    setShowConfig(false);
    
    // Save to localStorage for persistence
    localStorage.setItem('llmConfig', JSON.stringify(config));
  };

  // Load config from localStorage on initial render
  useEffect(() => {
    const savedConfig = localStorage.getItem('llmConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig) as LLMConfig;
        setLLMConfig(config);
        setIsConfigured(true);
      } catch (error) {
        console.error('Error parsing saved LLM config:', error);
      }
    }
  }, []);

  // Function to determine expression based on message content
  const determineExpression = (message: string): 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised' => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
        lowerMessage.includes('great') || lowerMessage.includes('happy') ||
        lowerMessage.includes('thank')) {
      return 'happy';
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('sorry') || 
               lowerMessage.includes('error') || lowerMessage.includes('fail')) {
      return 'sad';
    } else if (lowerMessage.includes('?') || lowerMessage.includes('think') || 
               lowerMessage.includes('consider') || lowerMessage.includes('maybe')) {
      return 'thinking';
    } else if (lowerMessage.includes('wow') || lowerMessage.includes('amazing') || 
               lowerMessage.includes('incredible') || lowerMessage.includes('surprise')) {
      return 'surprised';
    }
    
    return 'neutral';
  };

  // Function to connect to an LLM API
  const handleSendMessage = async (message: string): Promise<string> => {
    // Set the head to "thinking" expression while waiting for response
    setExpression('thinking');
    setSpeaking(true);
    
    try {
      // Add user message to conversation history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: message }
      ];
      setConversationHistory(updatedHistory);
      
      let response = '';
      
      // If LLM is configured, use it
      if (isConfigured && llmConfig) {
        response = await sendMessageToLLM(message, llmConfig, conversationHistory);
      } else {
        // Use mock responses if not configured
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          response = "Hello there! How can I help you today?";
        } else if (lowerMessage.includes('how are you')) {
          response = "I'm doing well, thank you for asking! How about you?";
        } else if (lowerMessage.includes('?')) {
          response = "That's an interesting question. Let me think about it...";
        } else {
          response = `I received your message: "${message}". How can I assist you further?`;
        }
      }
      
      // Determine expression based on response content
      const newExpression = determineExpression(response);
      setExpression(newExpression);
      
      // Add assistant response to conversation history
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: response }
      ]);
      
      // Simulate speaking for the duration of the response
      setTimeout(() => {
        setSpeaking(false);
      }, response.length * 50); // Rough estimate of speaking time
      
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      setExpression('sad');
      setSpeaking(false);
      return "Sorry, there was an error processing your request. Please check your API configuration.";
    }
  };

  // Listen for chat response events
  useEffect(() => {
    const handleChatResponse = (event: CustomEvent<{ message: string }>) => {
      const message = event.detail.message;
      
      // Determine expression based on message content
      setExpression(determineExpression(message));
      setSpeaking(true);
      
      // Stop speaking after a delay based on message length
      setTimeout(() => {
        setSpeaking(false);
      }, message.length * 50); // Rough estimate of speaking time
    };

    window.addEventListener('chatResponse' as any, handleChatResponse);
    
    return () => {
      window.removeEventListener('chatResponse' as any, handleChatResponse);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <header className="w-full max-w-4xl py-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Animated Head Chatbot</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Chat with an AI assistant with an animated talking head</p>
      </header>
      
      <main className="flex flex-col w-full max-w-4xl flex-grow items-center justify-center gap-8 py-8">
        {showConfig ? (
          <div className="w-full max-w-md">
            <LLMConfigComponent 
              onSave={handleSaveConfig} 
              initialConfig={llmConfig || undefined}
            />
            <button
              onClick={() => setShowConfig(false)}
              className="mt-4 w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row w-full items-center justify-center gap-8">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="w-64 h-64">
                  <SVGHead 
                    expression={expression} 
                    speaking={speaking} 
                    containerStyle={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <Chat 
                  onSendMessage={handleSendMessage}
                  className="h-[500px] border border-gray-200 dark:border-gray-700 rounded-lg shadow-md"
                />
              </div>
            </div>
            
            <div className="w-full flex justify-center mt-6">
              <button
                onClick={() => setShowConfig(true)}
                className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors flex items-center"
              >
                {isConfigured ? 'Change LLM Configuration' : 'Configure LLM API'}
              </button>
            </div>
          </>
        )}
      </main>
      
      <footer className="w-full max-w-4xl py-6 text-center text-gray-600 dark:text-gray-400">
        <p>Connect this chatbot to your favorite LLM API</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="https://openai.com/api/" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenAI</a>
          <a href="https://azure.microsoft.com/en-us/products/ai-services/openai-service" target="_blank" rel="noopener noreferrer" className="hover:underline">Azure OpenAI</a>
          <a href="https://www.anthropic.com/api" target="_blank" rel="noopener noreferrer" className="hover:underline">Anthropic Claude</a>
        </div>
      </footer>
    </div>
  );
}
