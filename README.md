# Animated Head Chatbot

A React-based chatbot application with an animated talking head that can be connected to any LLM API.

## Features

- Chat interface with message history
- Two types of animated heads:
  - 2D SVG-based head with facial expressions
  - 3D head using Three.js
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Next.js for server-side rendering and API routes
- Easy to connect to any LLM API (OpenAI, Anthropic, local models, etc.)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/animated-head-chatbot.git
cd animated-head-chatbot
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Connecting to an LLM API

To connect to an LLM API, modify the `src/app/api/chat/route.ts` file. The file contains comments explaining how to integrate with different LLM providers.

Example for OpenAI:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
```

## Customizing the Animated Head

### SVG Head

The SVG head can be customized by modifying the `src/components/SVGHead/index.tsx` file. You can change the facial features, expressions, and animations.

### 3D Head

The 3D head can be customized by modifying the `src/components/ThreeJSHead/index.tsx` file. You can replace the simple 3D model with a more complex one or add more animations.

## License

MIT
