import React, { useState, useEffect } from 'react';
import Chat from '../Chat';
import SVGHead from '../SVGHead';
import ThreeJSHead from '../ThreeJSHead';
import './styles.css';

interface ChatWithHeadProps {
  headType?: 'svg' | '3d';
  className?: string;
  apiEndpoint?: string;
}

const ChatWithHead: React.FC<ChatWithHeadProps> = ({
  headType = 'svg',
  className = '',
  apiEndpoint = '/api/chat'
}) => {
  const [speaking, setSpeaking] = useState(false);
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'>('neutral');

  // Function to analyze message sentiment and set appropriate expression
  const analyzeMessage = (message: string) => {
    // This is a very simple sentiment analysis
    // In a real app, you would use a more sophisticated approach or an API
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('error') || lowerMessage.includes('sorry') || lowerMessage.includes('cannot')) {
      return 'sad';
    } else if (lowerMessage.includes('great') || lowerMessage.includes('happy') || lowerMessage.includes('excellent')) {
      return 'happy';
    } else if (lowerMessage.includes('hmm') || lowerMessage.includes('let me think') || lowerMessage.includes('interesting')) {
      return 'thinking';
    } else if (lowerMessage.includes('wow') || lowerMessage.includes('amazing') || lowerMessage.includes('incredible')) {
      return 'surprised';
    }
    
    return 'neutral';
  };

  // Listen for chat response events
  useEffect(() => {
    const handleChatResponse = (event: CustomEvent) => {
      const message = event.detail?.message || '';
      
      // Set expression based on message content
      setExpression(analyzeMessage(message));
      
      // Animate speaking
      setSpeaking(true);
      
      // Stop speaking after a delay proportional to message length
      const speakingDuration = Math.min(Math.max(message.length * 50, 1000), 5000);
      setTimeout(() => {
        setSpeaking(false);
      }, speakingDuration);
    };

    window.addEventListener('chatResponse' as any, handleChatResponse);
    
    return () => {
      window.removeEventListener('chatResponse' as any, handleChatResponse);
    };
  }, []);

  // Function to send message to API
  const sendMessage = async (message: string): Promise<string> => {
    try {
      // Set thinking expression while waiting for response
      setExpression('thinking');
      
      // In a real app, you would call your API here
      // For now, we'll simulate a delay and return a mock response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const responses = [
        `I understand you're saying: "${message}". How can I help you further?`,
        `That's an interesting point about "${message}". Let me elaborate...`,
        `Thanks for sharing your thoughts on "${message}". Here's what I think...`,
        `I'm processing your message about "${message}". Let me respond...`
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  return (
    <div className={`chat-with-head ${className}`}>
      <div className="head-container">
        {headType === 'svg' ? (
          <SVGHead 
            expression={expression} 
            speaking={speaking} 
            containerStyle={{ width: '200px', height: '200px', margin: '0 auto' }}
          />
        ) : (
          <ThreeJSHead 
            expression={expression} 
            speaking={speaking} 
            containerStyle={{ width: '300px', height: '300px', margin: '0 auto' }}
          />
        )}
      </div>
      
      <div className="chat-interface">
        <Chat onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatWithHead;