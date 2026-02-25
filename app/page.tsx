import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Krupee</h1>
          <p className="text-slate-600">
            AI Chatbot for Ticker Information
          </p>
        </header>
        <ChatInterface />
      </div>
    </main>
  );
}