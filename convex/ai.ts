import { v } from "convex/values";
import { internalAction, internalMutation, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { generateText, experimental_generateImage as aiGenerateImage } from "ai";
import { openai } from "@ai-sdk/openai";

const TICKER_SYSTEM_PROMPT = `You are Krupee, a financial assistant specializing in stock ticker information.

Your role is to help users understand stock tickers, company information, and general market context.

When users mention a ticker symbol or company name:
1. Identify the ticker symbol (e.g., AAPL for Apple, TSLA for Tesla)
2. Provide the full company name
3. Share relevant sector/industry information
4. Mention the stock exchange where it's primarily listed
5. Give a brief overview of what the company does

Guidelines:
- Be concise but informative
- If you're unsure about real-time data, focus on factual company information
- You can discuss general market trends and company fundamentals
- Always clarify that you don't have access to real-time stock prices
- Be helpful and professional in tone

Note: I don't have access to live market data, so I cannot provide current stock prices or real-time trading information.`;

export const generateResponse = internalAction({
  args: {
    sessionId: v.id("sessions"),
    userMessage: v.string(),
  },
  handler: async (ctx, { sessionId, userMessage }) => {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: TICKER_SYSTEM_PROMPT,
        prompt: userMessage,
        maxTokens: 500,
      });

      await ctx.runMutation(internal.ai.saveResponse, {
        sessionId,
        content: text,
      });
    } catch (error) {
      console.error("AI generation error:", error);
      
      await ctx.runMutation(internal.ai.saveResponse, {
        sessionId,
        content: "I apologize, but I encountered an error. Please try again.",
      });
    }
  },
});

export const saveResponse = internalMutation({
  args: {
    sessionId: v.id("sessions"),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, content }) => {
    await ctx.db.insert("messages", {
      sessionId,
      role: "assistant",
      content,
      createdAt: Date.now(),
    });
  },
});

export const saveGeneratedImage = internalMutation({
  args: {
    prompt: v.string(),
    url: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, { prompt, url, error }) => {
    await ctx.db.insert("generatedImages", {
      prompt,
      url,
      error,
      createdAt: Date.now(),
    });
  },
});

export const generateImage = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, { prompt }) => {
    try {
      const { image } = await aiGenerateImage({
        model: openai.image("dall-e-3"),
        prompt,
        size: "1024x1024",
      });

      await ctx.runMutation(internal.ai.saveGeneratedImage, {
        prompt,
        url: image.base64,
      });

      return { url: image.base64 };
    } catch (error) {
      console.error("Image generation error:", error);
      
      await ctx.runMutation(internal.ai.saveGeneratedImage, {
        prompt,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw new Error("Failed to generate image. Please check your API key.");
    }
  },
});