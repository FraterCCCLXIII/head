// LLM API Client
// This file provides functions to connect to various LLM APIs

// Types for API configuration
export type OpenAIConfig = {
  provider: 'openai';
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
};

export type AzureOpenAIConfig = {
  provider: 'azure';
  apiKey: string;
  endpoint: string;
  deploymentName: string;
  apiVersion?: string;
  temperature?: number;
  maxTokens?: number;
};

export type AnthropicConfig = {
  provider: 'anthropic';
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
};

export type LLMConfig = OpenAIConfig | AzureOpenAIConfig | AnthropicConfig;

// Function to send a message to an LLM API
export async function sendMessageToLLM(
  message: string,
  config: LLMConfig,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string> {
  try {
    switch (config.provider) {
      case 'openai':
        return await sendToOpenAI(message, config, conversationHistory);
      case 'azure':
        return await sendToAzureOpenAI(message, config, conversationHistory);
      case 'anthropic':
        return await sendToAnthropic(message, config, conversationHistory);
      default:
        throw new Error(`Unsupported provider: ${(config as any).provider}`);
    }
  } catch (error) {
    console.error('Error sending message to LLM:', error);
    throw error;
  }
}

// OpenAI API implementation
async function sendToOpenAI(
  message: string,
  config: OpenAIConfig,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const messages = [
    ...conversationHistory,
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 1000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Azure OpenAI API implementation
async function sendToAzureOpenAI(
  message: string,
  config: AzureOpenAIConfig,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const messages = [
    ...conversationHistory,
    { role: 'user', content: message }
  ];

  const apiVersion = config.apiVersion || '2023-05-15';
  const url = `${config.endpoint}/openai/deployments/${config.deploymentName}/chat/completions?api-version=${apiVersion}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.apiKey
    },
    body: JSON.stringify({
      messages,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 1000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Azure OpenAI API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Anthropic API implementation
async function sendToAnthropic(
  message: string,
  config: AnthropicConfig,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  // Convert the conversation history to Anthropic's format
  let prompt = '';
  
  for (const msg of conversationHistory) {
    if (msg.role === 'user') {
      prompt += `\n\nHuman: ${msg.content}`;
    } else {
      prompt += `\n\nAssistant: ${msg.content}`;
    }
  }
  
  prompt += `\n\nHuman: ${message}\n\nAssistant:`;

  const response = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: config.model,
      prompt,
      temperature: config.temperature ?? 0.7,
      max_tokens_to_sample: config.maxTokens ?? 1000,
      stop_sequences: ["\n\nHuman:"]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.completion.trim();
}