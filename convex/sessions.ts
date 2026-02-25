import { mutation } from "./_generated/server";

export const getOrCreateSession = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (identity) {
      const existing = await ctx.db
        .query("sessions")
        .withIndex("by_fingerprint", (q) => q.eq("fingerprint", identity.subject))
        .unique();
      
      if (existing) {
        await ctx.db.patch(existing._id, { lastActiveAt: Date.now() });
        return existing._id;
      }
      
      return await ctx.db.insert("sessions", {
        fingerprint: identity.subject,
        lastActiveAt: Date.now(),
      });
    }
    
    return await ctx.db.insert("sessions", {
      lastActiveAt: Date.now(),
    });
  },
});