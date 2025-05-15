import React, { useState, useRef, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';

interface HeadSelectorProps {
  onSelectHead: (headType: 'svg' | '3d' | 'gamebuddy') => void;
  currentHead: 'svg' | '3d' | 'gamebuddy';
}

const HeadSelector: React.FC<HeadSelectorProps> = ({ onSelectHead, currentHead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleHeadSelect = (headType: 'svg' | '3d' | 'gamebuddy') => {
    onSelectHead(headType);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
        aria-label="Head options"
      >
        <FiSettings className="w-5 h-5 text-neutral-700" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentHead === 'gamebuddy' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleHeadSelect('gamebuddy')}
              role="menuitem"
            >
              GameBuddy Head
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentHead === 'svg' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleHeadSelect('svg')}
              role="menuitem"
            >
              SVG Head
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentHead === '3d' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleHeadSelect('3d')}
              role="menuitem"
            >
              3D Head
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadSelector;