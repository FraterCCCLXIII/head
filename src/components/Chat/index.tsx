import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import './styles.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<string>;
  className?: string;
}

const Chat: React.FC<ChatProps> = ({ 
  initialMessages = [], 
  onSendMessage,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // For the 3D scroll effect
  const { scrollY } = useScroll({
    container: messagesContainerRef
  });
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      let response = '';
      
      if (onSendMessage) {
        // Use the provided onSendMessage function
        response = await onSendMessage(input);
      } else {
        // Mock API call with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        response = `This is a mock response to: "${input}"`;
      }
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Dispatch custom event for the animated head
      const chatResponseEvent = new CustomEvent('chatResponse', { 
        detail: { message: response } 
      });
      window.dispatchEvent(chatResponseEvent);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create message variants based on scroll position
  const createMessageVariants = (index: number) => {
    // Calculate the position where this message should start fading
    const startFadePosition = index * 100; // Adjust this value as needed
    
    // Create transform values based on scroll position
    const opacity = useTransform(
      scrollY, 
      [startFadePosition, startFadePosition + 150], 
      [1, 0]
    );
    
    const scale = useTransform(
      scrollY, 
      [startFadePosition, startFadePosition + 150], 
      [1, 0.9]
    );
    
    const rotateX = useTransform(
      scrollY, 
      [startFadePosition, startFadePosition + 150], 
      [0, 15]
    );
    
    const translateZ = useTransform(
      scrollY, 
      [startFadePosition, startFadePosition + 150], 
      [0, -30]
    );
    
    return { opacity, scale, rotateX, translateZ };
  };

  return (
    <div className={`chat-container ${className}`}>
      <div 
        ref={messagesContainerRef}
        className="messages-container"
        style={{ perspective: '1000px' }}
      >
        {messages.map((message, index) => {
          const { opacity, scale, rotateX, translateZ } = createMessageVariants(index);
          
          return (
            <motion.div 
              key={message.id} 
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              style={{ 
                opacity,
                scale,
                rotateX,
                translateZ,
                transformOrigin: message.role === 'user' ? 'bottom right' : 'bottom left',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="message-content">{message.content}</div>
            </motion.div>
          );
        })}
        {isLoading && (
          <motion.div 
            className="message assistant-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="message-input"
        />
        <motion.button 
          type="submit" 
          disabled={isLoading || !input.trim()} 
          className="send-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send
        </motion.button>
      </form>
    </div>
  );
};

export default Chat;