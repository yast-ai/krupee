# Krupee

A Next.js 16 App Router full-stack application with Convex backend and AI SDK integration.

## Features

- AI Chatbot for stock ticker information
- AI Image Generation
- Next.js 16 with App Router
- Convex real-time backend
- No authentication required

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and add your API key(s)
4. Run `npm run convex` to set up and start Convex locally
5. Run `npm run dev` to start the development server

`npm run dev`, `npm run build`, and `npm run lint` all run Convex code generation first to ensure `convex/_generated` types are available.

## Usage

The chatbot is specifically tuned to provide information about stock tickers. Ask about any company or ticker symbol like AAPL, TSLA, GOOGL, etc.

## System Prompt

The chatbot uses a specialized system prompt focused on ticker information, helping users understand companies, sectors, and market context.