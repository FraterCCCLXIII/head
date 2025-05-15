import React, { useState, useEffect, useRef } from 'react';
import Chat from '../Chat';
import SVGHead from '../SVGHead';
import ThreeJSHead from '../ThreeJSHead';
import GameBuddyHead from '../GameBuddyHead';
import './styles.css';

interface ChatWithHeadProps {
  headType?: 'svg' | '3d' | 'gamebuddy';
  className?: string;
  apiUrl?: string;
}

const ChatWithHead: React.FC<ChatWithHeadProps> = ({
  headType = 'svg',
  className = '',
  apiUrl = '/api/chat'
}) => {
  const [speaking, setSpeaking] = useState(false);
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised' | 'angry'>('neutral');
  const [headHeight, setHeadHeight] = useState(40); // 40% of viewport height
  const resizerRef = useRef<HTMLDivElement>(null);

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
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('upset') || lowerMessage.includes('mad')) {
      return 'angry';
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

    window.addEventListener('chatResponse' as unknown as string, handleChatResponse);
    
    return () => {
      window.removeEventListener('chatResponse' as unknown as string, handleChatResponse);
    };
  }, []);

  // Setup resizer functionality
  useEffect(() => {
    const resizer = resizerRef.current;
    if (!resizer) return;

    let startY = 0;
    let startHeight = 0;

    const onMouseDown = (e: MouseEvent) => {
      startY = e.clientY;
      startHeight = headHeight;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    };

    const onMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - startY;
      const newHeight = Math.max(20, Math.min(70, startHeight + (delta / window.innerHeight) * 100));
      setHeadHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    resizer.addEventListener('mousedown', onMouseDown);

    return () => {
      resizer.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [headHeight]);

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

  // Track the current message for GameBuddyHead
  const [currentMessage, setCurrentMessage] = useState('');

  // Modified sendMessage to track the current message and dispatch custom event
  const sendMessageWithTracking = async (message: string): Promise<string> => {
    try {
      // Set thinking expression while waiting for response
      setExpression('thinking');
      
      const response = await sendMessage(message);
      
      // Set the current message for GameBuddyHead
      setCurrentMessage(response);
      
      // Set expression based on message content
      const newExpression = analyzeMessage(response);
      setExpression(newExpression as 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised' | 'angry');
      
      // Dispatch custom event for GameBuddyHead to react to
      const chatResponseEvent = new CustomEvent('chatResponse', {
        detail: {
          message: response,
          expression: newExpression
        }
      });
      window.dispatchEvent(chatResponseEvent);
      
      // Animate speaking
      setSpeaking(true);
      
      // Stop speaking after a delay proportional to message length
      // For GameBuddyHead, this is less important as it has its own timing
      const speakingDuration = Math.min(Math.max(response.length * 80, 2000), 10000);
      setTimeout(() => {
        setSpeaking(false);
      }, speakingDuration);
      
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      setExpression('sad');
      const errorMessage = 'Sorry, there was an error processing your request.';
      setCurrentMessage(errorMessage);
      return errorMessage;
    }
  };

  return (
    <div className={`chat-with-head ${className}`}>
      <div className="head-container" style={{ height: `${headHeight}vh` }}>
        {headType === 'svg' ? (
          <SVGHead 
            expression={expression} 
            speaking={speaking} 
            containerStyle={{ width: '250px', height: '250px', margin: '0 auto' }}
          />
        ) : headType === '3d' ? (
          <ThreeJSHead 
            expression={expression} 
            speaking={speaking} 
            containerStyle={{ width: '350px', height: '350px', margin: '0 auto' }}
          />
        ) : (
          <GameBuddyHead
            expression={expression}
            speaking={speaking}
            message={currentMessage}
            containerStyle={{ width: '280px', height: '280px', margin: '0 auto' }}
          />
        )}
      </div>
      
      {/* Resizer handle */}
      <div className="resizer" ref={resizerRef}></div>
      
      <div className="chat-interface" style={{ height: `${100 - headHeight - 1}vh` }}>
        <Chat onSendMessage={sendMessageWithTracking} />
      </div>
    </div>
  );
};

export default ChatWithHead;