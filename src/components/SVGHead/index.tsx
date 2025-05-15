import React, { useEffect, useState } from 'react';

interface SVGHeadProps {
  expression?: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';
  speaking?: boolean;
  containerStyle?: React.CSSProperties;
}

const SVGHead: React.FC<SVGHeadProps> = ({ 
  expression = 'neutral', 
  speaking = false,
  containerStyle = {} 
}) => {
  const [mouthOpen, setMouthOpen] = useState(false);
  
  // Speaking animation effect
  useEffect(() => {
    if (!speaking) {
      setMouthOpen(false);
      return;
    }
    
    const interval = setInterval(() => {
      setMouthOpen(prev => !prev);
    }, 150);
    
    return () => clearInterval(interval);
  }, [speaking]);

  // Get facial features based on expression
  const getFacialFeatures = () => {
    switch (expression) {
      case 'happy':
        return {
          eyes: 'M25,25 Q30,20 35,25', // curved up
          mouth: mouthOpen 
            ? 'M20,60 Q35,70 50,60' // open happy mouth
            : 'M20,60 Q35,65 50,60', // closed happy mouth
          eyebrows: 'M20,15 Q30,10 40,15'
        };
      case 'sad':
        return {
          eyes: 'M25,25 Q30,30 35,25', // curved down
          mouth: mouthOpen 
            ? 'M20,65 Q35,60 50,65' // open sad mouth
            : 'M20,65 Q35,60 50,65', // closed sad mouth
          eyebrows: 'M20,10 Q30,15 40,10'
        };
      case 'thinking':
        return {
          eyes: 'M25,25 L35,25', // straight
          mouth: mouthOpen 
            ? 'M20,60 Q35,65 50,65' // slightly open thinking mouth
            : 'M20,60 L50,60', // straight mouth
          eyebrows: 'M20,10 Q30,5 40,15' // one raised eyebrow
        };
      case 'surprised':
        return {
          eyes: 'M25,25 Q30,25 35,25', // wide eyes
          mouth: mouthOpen 
            ? 'M20,60 Q35,75 50,60' // very open surprised mouth
            : 'M20,60 Q35,70 50,60', // open surprised mouth
          eyebrows: 'M20,5 Q30,0 40,5' // raised eyebrows
        };
      default: // neutral
        return {
          eyes: 'M25,25 L35,25', // straight
          mouth: mouthOpen 
            ? 'M20,60 Q35,65 50,60' // slightly open mouth
            : 'M20,60 L50,60', // straight mouth
          eyebrows: 'M20,15 L40,15' // straight eyebrows
        };
    }
  };

  const { eyes, mouth, eyebrows } = getFacialFeatures();

  // Listen for chat response events
  useEffect(() => {
    const handleChatResponse = (event: CustomEvent) => {
      // You can add more sophisticated animation logic here based on the message content
      // For now, we'll just use the speaking prop that's passed in
    };

    window.addEventListener('chatResponse' as any, handleChatResponse);
    
    return () => {
      window.removeEventListener('chatResponse' as any, handleChatResponse);
    };
  }, []);

  return (
    <div style={{ width: '200px', height: '200px', ...containerStyle }}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="50" cy="50" r="40" fill="#FFD8B4" stroke="#000" strokeWidth="1" />
        
        {/* Left Eye */}
        <path d={eyes} transform="translate(0, 0)" stroke="#000" strokeWidth="2" fill="none" />
        
        {/* Right Eye */}
        <path d={eyes} transform="translate(30, 0)" stroke="#000" strokeWidth="2" fill="none" />
        
        {/* Left Eyebrow */}
        <path d={eyebrows} transform="translate(0, 0)" stroke="#000" strokeWidth="2" fill="none" />
        
        {/* Right Eyebrow */}
        <path d={eyebrows} transform="translate(30, 0)" stroke="#000" strokeWidth="2" fill="none" />
        
        {/* Mouth */}
        <path d={mouth} stroke="#000" strokeWidth="2" fill={mouthOpen ? "#FF9999" : "none"} />
      </svg>
    </div>
  );
};

export default SVGHead;