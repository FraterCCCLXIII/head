"use client";

import { useState, useEffect } from "react";
import Chat from "@/src/components/Chat";
import SVGHead from "@/src/components/SVGHead";
import ThreeJSHead from "@/src/components/ThreeJSHead";
import GameBuddyHead from "@/src/components/GameBuddyHead";
import HeadSelector from "@/src/components/HeadSelector";
import ApiSettings from "@/src/components/ApiSettings";
import ResizableGrip from "@/src/components/ResizableGrip";
import { LLMConfig, sendMessageToLLM } from "@/src/utils/llmClient";

export default function Home() {
  const [speaking, setSpeaking] = useState(false);
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'>('neutral');
  const [headType, setHeadType] = useState<'svg' | '3d' | 'gamebuddy'>('gamebuddy');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiEndpoint, setApiEndpoint] = useState<string>('https://api.openai.com/v1/chat/completions');
  const [conversationHistory, setConversationHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [headHeight, setHeadHeight] = useState<number>(300);
  const [chatHeight, setChatHeight] = useState<number>(300);

  // Load config from localStorage on initial render
  useEffect(() => {
    // Load API settings
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    const savedApiEndpoint = localStorage.getItem('apiEndpoint');
    if (savedApiEndpoint) {
      setApiEndpoint(savedApiEndpoint);
    }
    
    if (savedApiKey && savedApiEndpoint) {
      setIsConfigured(true);
    }
    
    // Load head type preference
    const savedHeadType = localStorage.getItem('headType') as 'svg' | '3d' | 'gamebuddy' | null;
    if (savedHeadType) {
      setHeadType(savedHeadType);
    }
    
    // Load saved heights
    const savedHeadHeight = localStorage.getItem('headHeight');
    if (savedHeadHeight) {
      setHeadHeight(parseInt(savedHeadHeight, 10));
    }
    
    const savedChatHeight = localStorage.getItem('chatHeight');
    if (savedChatHeight) {
      setChatHeight(parseInt(savedChatHeight, 10));
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
        { role: 'user' as const, content: message }
      ];
      setConversationHistory(updatedHistory);
      
      let response = '';
      
      // If LLM is configured, use it
      if (isConfigured && apiKey) {
        const config: LLMConfig = {
          provider: 'openai',
          apiKey: apiKey,
          model: 'gpt-3.5-turbo', // Default model
          temperature: 0.7,
          maxTokens: 1000
        };
        
        response = await sendMessageToLLM(message, config, conversationHistory);
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
        { role: 'assistant' as const, content: response }
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

  // Handle API key change
  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('apiKey', newApiKey);
    setIsConfigured(!!newApiKey && !!apiEndpoint);
  };

  // Handle API endpoint change
  const handleApiEndpointChange = (newEndpoint: string) => {
    setApiEndpoint(newEndpoint);
    localStorage.setItem('apiEndpoint', newEndpoint);
    setIsConfigured(!!apiKey && !!newEndpoint);
  };

  // Handle head type change
  const handleHeadTypeChange = (newHeadType: 'svg' | '3d' | 'gamebuddy') => {
    setHeadType(newHeadType);
    localStorage.setItem('headType', newHeadType);
  };
  
  // Handle resizing between head and chat areas
  const handleResize = (newHeadHeight: number, newChatHeight: number) => {
    setHeadHeight(newHeadHeight);
    setChatHeight(newChatHeight);
    
    // Save to localStorage for persistence
    localStorage.setItem('headHeight', newHeadHeight.toString());
    localStorage.setItem('chatHeight', newChatHeight.toString());
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

    window.addEventListener('chatResponse', handleChatResponse as EventListener);
    
    return () => {
      window.removeEventListener('chatResponse', handleChatResponse as EventListener);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-50">
      <main className="flex flex-col w-full max-w-4xl flex-grow items-center h-screen">
        {/* Top navigation bar */}
        <div className="w-full flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <HeadSelector 
              onSelectHead={handleHeadTypeChange} 
              currentHead={headType} 
            />
          </div>
          
          <div className="flex items-center">
            <ApiSettings 
              apiKey={apiKey}
              onApiKeyChange={handleApiKeyChange}
              apiEndpoint={apiEndpoint}
              onApiEndpointChange={handleApiEndpointChange}
            />
          </div>
        </div>
        
        {/* Head container */}
        <div 
          className="w-full flex flex-col items-center justify-center overflow-hidden"
          style={{ height: `${headHeight}px` }}
        >
          <div className="w-64 h-64">
            {headType === 'svg' && (
              <SVGHead
                expression={expression}
                speaking={speaking}
                containerStyle={{ width: '100%', height: '100%' }}
              />
            )}
            
            {headType === '3d' && (
              <ThreeJSHead
                expression={expression}
                speaking={speaking}
              />
            )}
            
            {headType === 'gamebuddy' && (
              <GameBuddyHead
                expression={expression}
                speaking={speaking}
                message={conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1].content : ''}
              />
            )}
          </div>
        </div>
        
        {/* Resizable grip */}
        <ResizableGrip 
          onResize={handleResize}
          containerHeight={headHeight + chatHeight}
          minHeadHeight={150}
          minChatHeight={150}
        />
        
        {/* Chat container */}
        <div 
          className="w-full px-4 pb-4 flex-grow"
          style={{ height: `${chatHeight}px` }}
        >
          <Chat
            onSendMessage={handleSendMessage}
            className="w-full h-full rounded-lg"
          />
        </div>
      </main>
    </div>
  );
}
