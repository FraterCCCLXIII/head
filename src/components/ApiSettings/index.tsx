import React, { useState } from 'react';
import { FiCpu } from 'react-icons/fi';

interface ApiSettingsProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
  apiEndpoint: string;
  onApiEndpointChange: (endpoint: string) => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({
  apiKey,
  onApiKeyChange,
  apiEndpoint,
  onApiEndpointChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [tempApiEndpoint, setTempApiEndpoint] = useState(apiEndpoint);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    onApiKeyChange(tempApiKey);
    onApiEndpointChange(tempApiEndpoint);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
        aria-label="API Settings"
      >
        <FiCpu className="w-5 h-5 text-neutral-700" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-neutral-800">API Settings</h2>
              <button
                onClick={handleClose}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="apiEndpoint" className="block text-sm font-medium text-neutral-700 mb-1">
                  API Endpoint
                </label>
                <input
                  type="text"
                  id="apiEndpoint"
                  value={tempApiEndpoint}
                  onChange={(e) => setTempApiEndpoint(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://api.example.com/v1/chat/completions"
                />
              </div>

              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-neutral-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="sk-..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiSettings;