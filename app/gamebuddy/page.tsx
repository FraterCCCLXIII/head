"use client";

import { useState } from "react";
import ChatWithHead from "@/src/components/ChatWithHead";
import LLMConfigComponent from "@/src/components/LLMConfig";
import { LLMConfig } from "@/src/utils/llmClient";

export default function GameBuddyPage() {
  const [showConfig, setShowConfig] = useState(false);
  const [llmConfig, setLLMConfig] = useState<LLMConfig | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [headType, setHeadType] = useState<'svg' | '3d' | 'gamebuddy'>('gamebuddy');

  // Function to handle LLM configuration
  const handleSaveConfig = (config: LLMConfig) => {
    setLLMConfig(config);
    setIsConfigured(true);
    setShowConfig(false);
    
    // Save to localStorage for persistence
    localStorage.setItem('llmConfig', JSON.stringify(config));
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
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
            <div className="flex flex-col w-full items-center justify-between h-screen">
              <ChatWithHead headType={headType} />
            </div>
            
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowConfig(true)}
                className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors flex items-center"
              >
                {isConfigured ? 'Change LLM Configuration' : 'Configure LLM API'}
              </button>
            </div>

            <div className="absolute top-4 left-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setHeadType('svg')}
                  className={`py-2 px-4 font-semibold rounded-md transition-colors ${
                    headType === 'svg' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  SVG Head
                </button>
                <button
                  onClick={() => setHeadType('3d')}
                  className={`py-2 px-4 font-semibold rounded-md transition-colors ${
                    headType === '3d' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  3D Head
                </button>
                <button
                  onClick={() => setHeadType('gamebuddy')}
                  className={`py-2 px-4 font-semibold rounded-md transition-colors ${
                    headType === 'gamebuddy' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Game Buddy
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}