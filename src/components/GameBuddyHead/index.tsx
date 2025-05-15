import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.module.css';

interface GameBuddyHeadProps {
  expression?: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised' | 'angry';
  speaking?: boolean;
  containerStyle?: React.CSSProperties;
  message?: string;
}

// Enhanced phoneme definitions with better tongue positioning
const phonemes = {
  // Vowels
  'A': { width: 50, height: 35, borderRadius: '40%', tongueWidth: 28, tongueHeight: 14, tongueBottom: -4, teethTopY: -12, teethBottomY: 12, teethWidth: '120%' },
  'E': { width: 65, height: 25, borderRadius: '15px', tongueWidth: 35, tongueHeight: 10, tongueBottom: -6, teethTopY: -8, teethBottomY: 8, teethWidth: '125%' },
  'I': { width: 40, height: 20, borderRadius: '15px', tongueWidth: 20, tongueHeight: 8, tongueBottom: -4, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'O': { width: 40, height: 40, borderRadius: '50%', tongueWidth: 22, tongueHeight: 16, tongueBottom: -2, teethTopY: -14, teethBottomY: 14, teethWidth: '115%' },
  'U': { width: 35, height: 35, borderRadius: '50%', tongueWidth: 18, tongueHeight: 14, tongueBottom: -2, teethTopY: -12, teethBottomY: 12, teethWidth: '110%' },
  // Consonants
  'M': { width: 55, height: 10, borderRadius: '5px', tongueWidth: 0, tongueHeight: 0, tongueBottom: 0, teethTopY: -4, teethBottomY: 4, teethWidth: '110%' },
  'B': { width: 55, height: 10, borderRadius: '5px', tongueWidth: 0, tongueHeight: 0, tongueBottom: 0, teethTopY: -4, teethBottomY: 4, teethWidth: '110%' },
  'P': { width: 55, height: 10, borderRadius: '5px', tongueWidth: 0, tongueHeight: 0, tongueBottom: 0, teethTopY: -4, teethBottomY: 4, teethWidth: '110%' },
  'F': { width: 55, height: 20, borderRadius: '5px', tongueWidth: 0, tongueHeight: 0, tongueBottom: 0, teethTopY: -8, teethBottomY: 8, teethWidth: '120%' },
  'V': { width: 55, height: 20, borderRadius: '5px', tongueWidth: 0, tongueHeight: 0, tongueBottom: 0, teethTopY: -8, teethBottomY: 8, teethWidth: '120%' },
  'L': { width: 50, height: 25, borderRadius: '15px', tongueWidth: 30, tongueHeight: 20, tongueBottom: -8, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
  'T': { width: 50, height: 15, borderRadius: '10px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -6, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'D': { width: 50, height: 15, borderRadius: '10px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -6, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'S': { width: 50, height: 15, borderRadius: '10px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -6, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'Z': { width: 50, height: 15, borderRadius: '10px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -6, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'N': { width: 50, height: 15, borderRadius: '10px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -6, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'R': { width: 50, height: 20, borderRadius: '15px', tongueWidth: 30, tongueHeight: 12, tongueBottom: -6, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
  'K': { width: 50, height: 20, borderRadius: '15px', tongueWidth: 30, tongueHeight: 12, tongueBottom: -8, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
  'G': { width: 50, height: 20, borderRadius: '15px', tongueWidth: 30, tongueHeight: 12, tongueBottom: -8, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
  'rest': { width: 30, height: 10, borderRadius: '5px', tongueWidth: 20, tongueHeight: 6, tongueBottom: -4, teethTopY: -4, teethBottomY: 4, teethWidth: '105%' }
};

// Expressions with emotional states
const expressions = {
  'neutral': { width: 60, height: 25, borderRadius: '15px', tongueWidth: 30, tongueHeight: 12, tongueBottom: -4, teethTopY: -6, teethBottomY: 6, teethWidth: '110%' },
  'happy': { width: 70, height: 35, borderRadius: '15px 15px 40px 40px', tongueWidth: 35, tongueHeight: 16, tongueBottom: -2, teethTopY: -10, teethBottomY: 10, teethWidth: '115%' },
  'sad': { width: 65, height: 30, borderRadius: '40px 40px 15px 15px', tongueWidth: 25, tongueHeight: 10, tongueBottom: -6, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
  'surprised': { width: 45, height: 45, borderRadius: '50%', tongueWidth: 25, tongueHeight: 18, tongueBottom: 0, teethTopY: -14, teethBottomY: 14, teethWidth: '110%' },
  'angry': { width: 60, height: 25, borderRadius: '5px', tongueWidth: 30, tongueHeight: 10, tongueBottom: -6, teethTopY: -8, teethBottomY: 8, teethWidth: '120%' },
  'thinking': { width: 50, height: 20, borderRadius: '15px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -4, teethTopY: -6, teethBottomY: 6, teethWidth: '110%' }
};

// Enhanced text to phoneme conversion with common word patterns
function convertTextToPhonemes(text: string): string {
  // This is still simplified but more sophisticated than the original
  const words = text.toUpperCase().split(/\s+/);
  let phonemesString = '';
  
  // Common word patterns to specific phoneme sequences
  const wordPatterns: Record<string, string> = {
    'HELLO': 'H E L O',
    'HI': 'H A I',
    'THE': 'TH E',
    'AND': 'A N D',
    'TO': 'T U',
    'YOU': 'Y U',
    'IS': 'I S',
    'ARE': 'A R',
    'WHAT': 'W A T',
    'HOW': 'H A U',
    'WHY': 'W A I',
    'WHEN': 'W E N',
    'WHERE': 'W E R',
    'WHO': 'H U',
    'WHICH': 'W I CH',
    'THAT': 'TH A T',
    'THIS': 'TH I S',
    'THESE': 'TH E S',
    'THOSE': 'TH O S',
    'THERE': 'TH E R',
    'THEIR': 'TH E R',
    'THEY': 'TH E',
    'THEM': 'TH E M',
    'CAN': 'K A N',
    'COULD': 'K U D',
    'WOULD': 'W U D',
    'SHOULD': 'SH U D',
    'WILL': 'W I L',
    'SHALL': 'SH A L',
    'MAY': 'M E',
    'MIGHT': 'M A I T',
    'MUST': 'M A S T',
    'HAVE': 'H A V',
    'HAS': 'H A S',
    'HAD': 'H A D',
    'DO': 'D U',
    'DOES': 'D A S',
    'DID': 'D I D',
    'DONE': 'D A N',
    'BE': 'B E',
    'BEEN': 'B I N',
    'BEING': 'B E I N G',
    'WAS': 'W A S',
    'WERE': 'W E R',
    'AM': 'A M',
    'FOR': 'F O R',
    'FROM': 'F R A M',
    'WITH': 'W I TH',
    'WITHOUT': 'W I TH A U T',
    'ABOUT': 'A B A U T',
    'ABOVE': 'A B A V',
    'BELOW': 'B E L O',
    'UNDER': 'A N D E R',
    'OVER': 'O V E R',
    'BETWEEN': 'B E T W E N',
    'AMONG': 'A M A N G',
    'THROUGH': 'TH R U',
    'THROUGHOUT': 'TH R U A U T',
    'ACROSS': 'A K R A S',
    'ALONG': 'A L A N G',
    'AROUND': 'A R A U N D',
    'AT': 'A T',
    'BY': 'B A I',
    'ON': 'A N',
    'IN': 'I N',
    'INTO': 'I N T U',
    'ONTO': 'A N T U',
    'OF': 'A V',
    'OFF': 'A F',
    'OUT': 'A U T',
    'OUTSIDE': 'A U T S A I D',
    'INSIDE': 'I N S A I D',
    'UP': 'A P',
    'DOWN': 'D A U N',
    'BEFORE': 'B E F O R',
    'AFTER': 'A F T E R',
    'DURING': 'D U R I N G',
    'SINCE': 'S I N S',
    'UNTIL': 'A N T I L',
    'TILL': 'T I L',
    'WHILE': 'W A I L',
    'BECAUSE': 'B E K A S',
    'THOUGH': 'TH O',
    'ALTHOUGH': 'A L TH O',
    'IF': 'I F',
    'UNLESS': 'A N L E S',
    'LEST': 'L E S T',
    'THAN': 'TH A N',
    'AS': 'A S',
    'SO': 'S O',
    'SUCH': 'S A CH',
    'RATHER': 'R A TH E R',
    'QUITE': 'K W A I T',
    'VERY': 'V E R E',
    'TOO': 'T U',
    'ALSO': 'A L S O',
    'ELSE': 'E L S',
    'AGAIN': 'A G E N',
    'ONCE': 'W A N S',
    'TWICE': 'T W A I S',
    'THRICE': 'TH R A I S',
    'FIRST': 'F E R S T',
    'SECOND': 'S E K A N D',
    'THIRD': 'TH E R D',
    'LAST': 'L A S T',
    'NEXT': 'N E K S T',
    'PREVIOUS': 'P R E V E A S',
    'NOW': 'N A U',
    'THEN': 'TH E N',
    'SOON': 'S U N',
    'LATER': 'L E T E R',
    'EARLY': 'E R L E',
    'LATE': 'L E T',
    'TODAY': 'T U D E',
    'TOMORROW': 'T U M A R O',
    'YESTERDAY': 'Y E S T E R D E',
    'HERE': 'H E R',
    'THERE': 'TH E R',
    'EVERYWHERE': 'E V R E W E R',
    'NOWHERE': 'N O W E R',
    'SOMEWHERE': 'S A M W E R',
    'ANYWHERE': 'E N E W E R',
    'YES': 'Y E S',
    'NO': 'N O',
    'NOT': 'N A T',
    'ALL': 'A L',
    'ANY': 'E N E',
    'SOME': 'S A M',
    'NONE': 'N A N',
    'MANY': 'M E N E',
    'MUCH': 'M A CH',
    'MORE': 'M O R',
    'MOST': 'M O S T',
    'LESS': 'L E S',
    'LEAST': 'L E S T',
    'SEVERAL': 'S E V E R A L',
    'FEW': 'F U',
    'LITTLE': 'L I T L',
    'EACH': 'E CH',
    'EVERY': 'E V R E',
    'EITHER': 'E TH E R',
    'NEITHER': 'N E TH E R',
    'BOTH': 'B O TH',
    'ONE': 'W A N',
    'TWO': 'T U',
    'THREE': 'TH R E',
    'FOUR': 'F O R',
    'FIVE': 'F A I V',
    'SIX': 'S I K S',
    'SEVEN': 'S E V E N',
    'EIGHT': 'E T',
    'NINE': 'N A I N',
    'TEN': 'T E N',
  };
  
  for (const word of words) {
    // Check for punctuation at the end of the word
    const hasPunctuation = /[.!?,;:]$/.test(word);
    const cleanWord = word.replace(/[^A-Z0-9]/g, '');
    
    // Check if we have a predefined pattern for this word
    if (wordPatterns[cleanWord]) {
      phonemesString += wordPatterns[cleanWord] + ' ';
    } else {
      // Process character by character if no pattern exists
      for (const char of cleanWord) {
        if ('AEIOU'.includes(char)) {
          phonemesString += char + ' ';
        } else if (/[A-Z]/.test(char)) {
          phonemesString += char + ' ';
        } else if (/[0-9]/.test(char)) {
          // Handle numbers
          phonemesString += 'N ' + char + ' ';
        }
      }
    }
    
    // Add appropriate pause based on punctuation
    if (hasPunctuation) {
      const lastChar = word[word.length - 1];
      if (lastChar === '?') {
        phonemesString += '? . . ';
      } else if (lastChar === '!') {
        phonemesString += '! . . ';
      } else if (lastChar === ',') {
        phonemesString += '. ';
      } else if (lastChar === '.') {
        phonemesString += '. . . ';
      } else if (lastChar === ';') {
        phonemesString += '. . ';
      } else if (lastChar === ':') {
        phonemesString += '. . ';
      }
    } else {
      // Small pause between words
      phonemesString += '. ';
    }
  }
  
  return phonemesString.trim();
}

const GameBuddyHead: React.FC<GameBuddyHeadProps> = ({
  expression = 'neutral',
  speaking = false,
  containerStyle = {},
  message = ''
}) => {
  const [currentShape, setCurrentShape] = useState(expressions[expression]);
  const [isTalking, setIsTalking] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(expression);
  const phonemeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const tongueRef = useRef<HTMLDivElement>(null);
  const teethTopRef = useRef<HTMLDivElement>(null);
  const teethBottomRef = useRef<HTMLDivElement>(null);

  // Apply mouth shape based on phoneme or expression
  const applyMouthShape = (shape: any) => {
    if (!mouthRef.current || !tongueRef.current || !teethTopRef.current || !teethBottomRef.current) return;
    
    // Apply mouth shape
    mouthRef.current.style.width = shape.width + 'px';
    mouthRef.current.style.height = shape.height + 'px';
    mouthRef.current.style.borderRadius = shape.borderRadius;
    
    // Apply tongue shape
    tongueRef.current.style.setProperty('--tongue-width', shape.tongueWidth + 'px');
    tongueRef.current.style.setProperty('--tongue-height', shape.tongueHeight + 'px');
    tongueRef.current.style.setProperty('--tongue-bottom', shape.tongueBottom + 'px');
    
    // Apply teeth positioning
    teethTopRef.current.style.setProperty('--teeth-top-y', shape.teethTopY + 'px');
    teethBottomRef.current.style.setProperty('--teeth-bottom-y', shape.teethBottomY + 'px');
    teethTopRef.current.style.setProperty('--teeth-width', shape.teethWidth);
    teethBottomRef.current.style.setProperty('--teeth-width', shape.teethWidth);
  };

  // Set expression
  const setExpressionState = (expressionName: string) => {
    setCurrentExpression(expressionName as any);
    if (!isTalking) {
      applyMouthShape(expressions[expressionName as keyof typeof expressions] || expressions.neutral);
    }
  };

  // Speak a single phoneme
  const speakPhoneme = (phoneme: string) => {
    if (phoneme === '.' || phoneme === ' ') {
      applyMouthShape(expressions[currentExpression as keyof typeof expressions]);
    } else if (phonemes[phoneme as keyof typeof phonemes]) {
      applyMouthShape(phonemes[phoneme as keyof typeof phonemes]);
    } else {
      applyMouthShape(phonemes['rest']);
    }
  };

  // Detect emotion from text content
  const detectEmotion = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Check for question marks
    if (text.includes('?')) {
      return 'thinking';
    }
    
    // Check for exclamation marks
    if (text.includes('!')) {
      // Check if it's a happy or angry exclamation
      if (/great|awesome|excellent|amazing|wonderful|fantastic|good|nice|love|happy|glad|joy|yay|hurray/i.test(lowerText)) {
        return 'happy';
      } else if (/terrible|awful|bad|hate|angry|mad|furious|upset|annoyed|frustrated|stupid|idiot|fool/i.test(lowerText)) {
        return 'angry';
      } else {
        return 'surprised';
      }
    }
    
    // Check for specific emotion words
    if (/happy|joy|glad|delighted|pleased|cheerful|content|satisfied|thrilled|excited/i.test(lowerText)) {
      return 'happy';
    } else if (/sad|unhappy|depressed|miserable|gloomy|disappointed|upset|heartbroken|grief|sorrow/i.test(lowerText)) {
      return 'sad';
    } else if (/angry|mad|furious|outraged|enraged|irritated|annoyed|frustrated|hostile|resentful/i.test(lowerText)) {
      return 'angry';
    } else if (/surprised|amazed|astonished|shocked|startled|stunned|astounded|dumbfounded|flabbergasted|wonder/i.test(lowerText)) {
      return 'surprised';
    } else if (/think|consider|ponder|contemplate|reflect|meditate|deliberate|analyze|evaluate|assess/i.test(lowerText)) {
      return 'thinking';
    }
    
    // Default to the provided expression
    return 'neutral';
  };

  // Store timeout IDs for cleanup
  const timeoutIdsRef = useRef<number[]>([]);
  
  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutIdsRef.current.forEach(id => window.clearTimeout(id));
    timeoutIdsRef.current = [];
  };
  
  // Speak a phrase with phonemes
  const speakPhrase = (text: string, expressionName: string = 'neutral') => {
    // Clear any existing timeouts and intervals
    clearAllTimeouts();
    if (phonemeIntervalRef.current) {
      clearInterval(phonemeIntervalRef.current);
      phonemeIntervalRef.current = null;
    }
    
    // Reset talking state
    setIsTalking(true);
    
    // Detect emotion from text if not explicitly provided
    const detectedEmotion = detectEmotion(text);
    const finalExpression = expressionName === 'neutral' ? detectedEmotion : expressionName;
    
    // Set initial expression
    setExpressionState(finalExpression);
    
    // Convert text to phonemes and split into array
    const phonemeList = convertTextToPhonemes(text).split(' ').filter(p => p.trim() !== '');
    console.log("Speaking phonemes:", phonemeList);
    
    let phonemeIndex = 0;
    
    // Dynamic timing based on phoneme type
    const getPhonemeSpeed = (phoneme: string): number => {
      if (phoneme === '.') {
        return 100; // Short pause
      } else if (phoneme === '..') {
        return 200; // Medium pause
      } else if (phoneme === '...') {
        return 300; // Long pause
      } else if (phoneme === '?' || phoneme === '!') {
        return 250; // Emphasis pause
      } else if ('AEIOU'.includes(phoneme)) {
        return 180; // Vowels slightly longer
      } else {
        return 120; // Consonants faster
      }
    };
    
    // Function to process the next phoneme
    const processNextPhoneme = () => {
      if (phonemeIndex >= phonemeList.length) {
        // End of speech
        setIsTalking(false);
        setExpressionState(finalExpression);
        return;
      }
      
      const currentPhoneme = phonemeList[phonemeIndex];
      
      // Check for expression changes based on punctuation
      if (currentPhoneme === '?') {
        setExpressionState('thinking');
      } else if (currentPhoneme === '!') {
        setExpressionState('surprised');
      } else if (phonemeIndex > 0 && phonemeIndex < phonemeList.length - 1) {
        // Occasionally change expression during speech for more natural look
        if (phonemeIndex % 20 === 0) {
          setExpressionState(finalExpression);
        }
      }
      
      // Speak the current phoneme
      speakPhoneme(currentPhoneme);
      
      // Get the timing for this phoneme
      const speed = getPhonemeSpeed(currentPhoneme);
      
      // Move to the next phoneme
      phonemeIndex++;
      
      // Schedule the next phoneme and store the timeout ID
      const timeoutId = window.setTimeout(processNextPhoneme, speed);
      timeoutIdsRef.current.push(timeoutId);
    };
    
    // Start the phoneme processing
    processNextPhoneme();
  };

  // Create a ref outside the effect to track the last message
  const lastMessageRef = useRef('');
  
  // Effect for speaking animation
  useEffect(() => {
    if (speaking && message && message !== lastMessageRef.current) {
      // Store the current message to avoid repeating
      lastMessageRef.current = message;
      
      // Start speaking the message
      speakPhrase(message, expression);
    } else if (!speaking) {
      // Stop any ongoing speech
      clearAllTimeouts();
      if (phonemeIntervalRef.current) {
        clearInterval(phonemeIntervalRef.current);
        phonemeIntervalRef.current = null;
      }
      setIsTalking(false);
      applyMouthShape(expressions[expression]);
    }
    
    // Cleanup function
    return () => {
      clearAllTimeouts();
      if (phonemeIntervalRef.current) {
        clearInterval(phonemeIntervalRef.current);
        phonemeIntervalRef.current = null;
      }
    };
  }, [speaking, message, expression]);
  
  // Effect to handle message changes even when speaking is not explicitly set
  useEffect(() => {
    if (message && message.trim() !== '' && message !== lastMessageRef.current) {
      console.log("New message detected:", message);
      // If we have a new message, start speaking it
      speakPhrase(message, expression);
    }
  }, [message]);
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (phonemeIntervalRef.current) {
        clearInterval(phonemeIntervalRef.current);
        phonemeIntervalRef.current = null;
      }
    };
  }, []);

  // Initialize
  useEffect(() => {
    setExpressionState(expression);
  }, []);

  // Listen for chat response events
  useEffect(() => {
    const handleChatResponse = (event: CustomEvent) => {
      const data = event.detail;
      if (data && data.message) {
        speakPhrase(data.message, data.expression || expression);
      }
    };

    window.addEventListener('chatResponse' as any, handleChatResponse);
    
    return () => {
      window.removeEventListener('chatResponse' as any, handleChatResponse);
    };
  }, [expression]);

  return (
    <div className={styles.gameBuddy} style={containerStyle}>
      <div className={styles.screen}>
        <div className={styles.face}>
          <div className={`${styles.eye} ${styles.left}`}></div>
          <div className={`${styles.eye} ${styles.right}`}></div>
          <div className={styles.mouthContainer}>
            <div className={styles.mouth} ref={mouthRef}>
              <div className={styles.mouthInner}>
                <div className={styles.teethTop} ref={teethTopRef}></div>
                <div className={styles.tongue} ref={tongueRef}></div>
                <div className={styles.teethBottom} ref={teethBottomRef}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBuddyHead;