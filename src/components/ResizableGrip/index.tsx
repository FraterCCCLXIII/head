import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

interface ResizableGripProps {
  onResize: (newHeadHeight: number, newChatHeight: number) => void;
  containerHeight: number;
  minHeadHeight?: number;
  minChatHeight?: number;
}

const ResizableGrip: React.FC<ResizableGripProps> = ({
  onResize,
  containerHeight,
  minHeadHeight = 150,
  minChatHeight = 150,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const gripRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !gripRef.current) return;

      const containerRect = gripRef.current.parentElement?.getBoundingClientRect();
      if (!containerRect) return;

      // Calculate position relative to container
      const relativeY = e.clientY - containerRect.top;
      
      // Ensure we respect minimum heights
      const headHeight = Math.max(minHeadHeight, relativeY);
      const chatHeight = Math.max(minChatHeight, containerHeight - headHeight);
      
      // Only resize if both minimum heights are respected
      if (headHeight + chatHeight <= containerHeight) {
        onResize(headHeight, chatHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize, containerHeight, minHeadHeight, minChatHeight]);

  return (
    <div 
      ref={gripRef}
      className="resizable-grip"
      onMouseDown={handleMouseDown}
    >
      <div className="grip-dots">
        <div className="grip-dot"></div>
        <div className="grip-dot"></div>
        <div className="grip-dot"></div>
      </div>
    </div>
  );
};

export default ResizableGrip;