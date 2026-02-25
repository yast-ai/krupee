"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export default function ChatMessage({ role, content, createdAt }: ChatMessageProps) {
  const isUser = role === "user";
  const formattedTime = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-slate-100 text-slate-800 rounded-bl-md"
        }`}
      >
        <div className="text-sm mb-1 opacity-70">
          {isUser ? "You" : "Krupee AI"} {formattedTime}
        </div>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
}