import React, { useState } from 'react';
import { LLMConfig } from '@/src/utils/llmClient';

interface LLMConfigProps {
  onSave: (config: LLMConfig) => void;
  initialConfig?: LLMConfig;
}

const LLMConfigComponent: React.FC<LLMConfigProps> = ({ onSave, initialConfig }) => {
  const [provider, setProvider] = useState<'openai' | 'azure' | 'anthropic'>(
    initialConfig?.provider || 'openai'
  );
  
  const [openaiConfig, setOpenaiConfig] = useState({
    apiKey: initialConfig?.provider === 'openai' ? (initialConfig as any).apiKey || '' : '',
    model: initialConfig?.provider === 'openai' ? (initialConfig as any).model || 'gpt-3.5-turbo' : 'gpt-3.5-turbo',
    temperature: initialConfig?.provider === 'openai' ? (initialConfig as any).temperature || 0.7 : 0.7,
    maxTokens: initialConfig?.provider === 'openai' ? (initialConfig as any).maxTokens || 1000 : 1000,
  });
  
  const [azureConfig, setAzureConfig] = useState({
    apiKey: initialConfig?.provider === 'azure' ? (initialConfig as any).apiKey || '' : '',
    endpoint: initialConfig?.provider === 'azure' ? (initialConfig as any).endpoint || '' : '',
    deploymentName: initialConfig?.provider === 'azure' ? (initialConfig as any).deploymentName || '' : '',
    apiVersion: initialConfig?.provider === 'azure' ? (initialConfig as any).apiVersion || '2023-05-15' : '2023-05-15',
    temperature: initialConfig?.provider === 'azure' ? (initialConfig as any).temperature || 0.7 : 0.7,
    maxTokens: initialConfig?.provider === 'azure' ? (initialConfig as any).maxTokens || 1000 : 1000,
  });
  
  const [anthropicConfig, setAnthropicConfig] = useState({
    apiKey: initialConfig?.provider === 'anthropic' ? (initialConfig as any).apiKey || '' : '',
    model: initialConfig?.provider === 'anthropic' ? (initialConfig as any).model || 'claude-2' : 'claude-2',
    temperature: initialConfig?.provider === 'anthropic' ? (initialConfig as any).temperature || 0.7 : 0.7,
    maxTokens: initialConfig?.provider === 'anthropic' ? (initialConfig as any).maxTokens || 1000 : 1000,
  });
  
  const handleSave = () => {
    let config: LLMConfig;
    
    switch (provider) {
      case 'openai':
        config = {
          provider: 'openai',
          ...openaiConfig
        };
        break;
      case 'azure':
        config = {
          provider: 'azure',
          ...azureConfig
        };
        break;
      case 'anthropic':
        config = {
          provider: 'anthropic',
          ...anthropicConfig
        };
        break;
      default:
        return;
    }
    
    onSave(config);
  };
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">LLM API Configuration</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Provider
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as any)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          <option value="openai">OpenAI</option>
          <option value="azure">Azure OpenAI</option>
          <option value="anthropic">Anthropic</option>
        </select>
      </div>
      
      {provider === 'openai' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={openaiConfig.apiKey}
              onChange={(e) => setOpenaiConfig({...openaiConfig, apiKey: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="sk-..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Model
            </label>
            <select
              value={openaiConfig.model}
              onChange={(e) => setOpenaiConfig({...openaiConfig, model: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temperature
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={openaiConfig.temperature}
                onChange={(e) => setOpenaiConfig({...openaiConfig, temperature: parseFloat(e.target.value)})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                value={openaiConfig.maxTokens}
                onChange={(e) => setOpenaiConfig({...openaiConfig, maxTokens: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
      
      {provider === 'azure' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={azureConfig.apiKey}
              onChange={(e) => setAzureConfig({...azureConfig, apiKey: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Endpoint
            </label>
            <input
              type="text"
              value={azureConfig.endpoint}
              onChange={(e) => setAzureConfig({...azureConfig, endpoint: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="https://your-resource-name.openai.azure.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deployment Name
            </label>
            <input
              type="text"
              value={azureConfig.deploymentName}
              onChange={(e) => setAzureConfig({...azureConfig, deploymentName: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Version
            </label>
            <input
              type="text"
              value={azureConfig.apiVersion}
              onChange={(e) => setAzureConfig({...azureConfig, apiVersion: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temperature
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={azureConfig.temperature}
                onChange={(e) => setAzureConfig({...azureConfig, temperature: parseFloat(e.target.value)})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                value={azureConfig.maxTokens}
                onChange={(e) => setAzureConfig({...azureConfig, maxTokens: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
      
      {provider === 'anthropic' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={anthropicConfig.apiKey}
              onChange={(e) => setAnthropicConfig({...anthropicConfig, apiKey: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="sk-ant-..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Model
            </label>
            <select
              value={anthropicConfig.model}
              onChange={(e) => setAnthropicConfig({...anthropicConfig, model: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="claude-2">Claude 2</option>
              <option value="claude-instant-1">Claude Instant</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temperature
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={anthropicConfig.temperature}
                onChange={(e) => setAnthropicConfig({...anthropicConfig, temperature: parseFloat(e.target.value)})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                value={anthropicConfig.maxTokens}
                onChange={(e) => setAnthropicConfig({...anthropicConfig, maxTokens: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSave}
        className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
      >
        Save Configuration
      </button>
    </div>
  );
};

export default LLMConfigComponent;