import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const listMessages = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("asc")
      .take(100);
  },
});

export const sendMessage = mutation({
  args: {
    sessionId: v.id("sessions"),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, content }) => {
    await ctx.db.insert("messages", {
      sessionId,
      role: "user",
      content,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.ai.generateResponse, {
      sessionId,
      userMessage: content,
    });
  },
});