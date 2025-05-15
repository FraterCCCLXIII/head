"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-center">Animated Head Chatbot</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Classic Heads</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Try our classic SVG and 3D animated heads with simple mouth animations.
          </p>
          <Link 
            href="/" 
            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors text-center"
          >
            Try Classic Heads
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Game Buddy Head</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Experience our advanced Game Buddy head with realistic mouth movements and phoneme-based animations.
          </p>
          <Link 
            href="/gamebuddy" 
            className="block w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-colors text-center"
          >
            Try Game Buddy Head
          </Link>
        </div>
      </div>
    </div>
  );
}