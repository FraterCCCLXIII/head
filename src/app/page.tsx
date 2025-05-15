'use client';

import React, { useState } from 'react';
import ChatWithHead from '@/components/ChatWithHead';

export default function Home() {
  const [headType, setHeadType] = useState<'svg' | '3d'>('svg');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Animated Head Chatbot
          </h1>
          <p className="text-gray-600 mb-4">
            Chat with an AI assistant with an animated talking head
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setHeadType('svg')}
              className={`px-4 py-2 rounded-md ${
                headType === 'svg'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              2D SVG Head
            </button>
            <button
              onClick={() => setHeadType('3d')}
              className={`px-4 py-2 rounded-md ${
                headType === '3d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              3D ThreeJS Head
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ChatWithHead headType={headType} />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This is a demo of a chatbot with an animated talking head.
            Try sending a message to see the head animate!
          </p>
        </div>
      </div>
    </main>
  );
}