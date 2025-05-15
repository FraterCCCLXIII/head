'use client';

import React, { useState } from 'react';
import ChatWithHead from '@/components/ChatWithHead';
import Layout from '@/components/Layout';

export default function Home() {
  const [headType, setHeadType] = useState<'svg' | '3d'>('svg');
  const [showApiConfig, setShowApiConfig] = useState(false);

  return (
    <Layout>
      {/* API Settings Button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowApiConfig(!showApiConfig)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Configure LLM API
        </button>
        
        {showApiConfig && (
          <div className="absolute right-0 mt-2 p-4 bg-white rounded-md shadow-lg w-80">
            <h3 className="text-lg font-medium mb-2">API Configuration</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Provider
              </label>
              <select className="w-full p-2 border rounded-md">
                <option value="openai">OpenAI</option>
                <option value="azure">Azure OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="local">Local Model</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter your API key"
              />
            </div>
            <div className="flex justify-end">
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md">
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Head Type Selector - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex gap-2">
          <button
            onClick={() => setHeadType('svg')}
            className={`px-3 py-1 rounded-md text-sm ${
              headType === 'svg'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            2D SVG
          </button>
          <button
            onClick={() => setHeadType('3d')}
            className={`px-3 py-1 rounded-md text-sm ${
              headType === '3d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            3D Model
          </button>
        </div>
      </div>

      {/* Main Content Area - Full Height */}
      <div className="w-full h-full flex flex-col">
        <ChatWithHead headType={headType} className="flex-grow" />
      </div>
    </Layout>
  );
}