import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    fingerprint: v.optional(v.string()),
    lastActiveAt: v.number(),
  }).index("by_fingerprint", ["fingerprint"]),

  messages: defineTable({
    sessionId: v.id("sessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_session", ["sessionId", "createdAt"]),

  generatedImages: defineTable({
    prompt: v.string(),
    url: v.optional(v.string()),
    error: v.optional(v.string()),
    createdAt: v.number(),
  }),
});