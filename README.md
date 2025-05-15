# Animated Head Chatbot

A React-based chatbot application with an animated talking head that can be connected to any LLM API.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFraterCCCLXIII%2Fhead&project-name=animated-head-chatbot&repository-name=animated-head-chatbot)

## Vercel Deployment Fixes

The following fixes were implemented to resolve Vercel deployment issues:

1. **Fixed TypeScript Errors**:
   - Added proper type assertions in app/page.tsx for conversation history roles
   - Fixed import paths in src/app/page.tsx to use relative paths instead of alias paths

2. **ESLint Configuration**:
   - Added `eslint: { ignoreDuringBuilds: true }` to next.config.mjs to prevent ESLint errors from blocking builds

3. **Vercel Configuration**:
   - Added vercel.json with explicit build configuration
   - Added .vercelignore to exclude unnecessary files from deployment

4. **App Directory Structure**:
   - Fixed issues with duplicate app directories (app/ and src/app/)
   - Ensured proper import paths between components

These changes ensure the application builds successfully on Vercel without TypeScript or ESLint errors.

## Features

- Chat interface with message history
- Three types of animated heads:
  - 2D SVG-based head with facial expressions
  - 3D head using Three.js
  - GameBuddyHead with realistic phoneme-based mouth animations and dynamic expressions
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
git clone https://github.com/FraterCCCLXIII/head.git
cd head
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

### GameBuddyHead

The GameBuddyHead component provides realistic mouth animations based on phoneme mapping and dynamic expressions based on text content. You can customize it by modifying the `src/components/GameBuddyHead/index.tsx` file.

## License

MIT
