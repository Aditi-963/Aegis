import React, { useState, useRef, useEffect } from "react";
import { GlassCard } from "../shared/GlassCard";
import { MessageSquare, Send, Radio, Loader } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export function RaceEngineerAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "AEGIS Race Engineer online. Telemetry uplink locked. Radio channel cleared. Sector 1, 2, and 3 coordinates sync'd. Ask me any strategy or telemetry anomaly questions.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested F1 commands
  const suggestions = [
    "Why are sector times increasing?",
    "Pit strategy recommendation?",
    "Analyze driver stress & HRP.",
    "Weather update & wets advisor?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          sender: "ai",
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      const errorMessage: Message = {
        sender: "ai",
        text: "RADIO STATIC: Connection to operations center lost. Retrying telemetry sector sync...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="flex flex-col justify-between min-h-[380px] max-h-[480px]">
      
      {/* Radio Header */}
      <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4.5 h-4.5 text-f1-red" />
          <span className="text-xs font-black uppercase font-telemetry tracking-wider">
            AI RACE ENGINEER ASSISTANT
          </span>
        </div>
        <span className="text-[10px] font-black uppercase text-emerald-400 font-telemetry bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded flex items-center">
          <Radio className="w-3 h-3 mr-1 animate-pulse" />
          VOICE CHANNEL
        </span>
      </div>

      {/* Messages Staging */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin max-h-[260px] min-h-[220px]"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            {/* Sender Label */}
            <span className="text-[8px] uppercase tracking-wider text-text-secondaryDark font-telemetry mb-1 leading-none">
              {msg.sender === "user" ? "PIT WALL COMMAND" : "ENGINEER RADIO"} • {msg.timestamp}
            </span>
            {/* Bubble */}
            <div 
              className={`
                p-2.5 
                rounded-lg 
                text-xs 
                leading-relaxed
                max-w-[85%]
                ${msg.sender === "user"
                  ? "bg-white/10 text-white border border-white/10"
                  : "bg-f1-red/10 text-white border border-f1-red/30 shadow-[0_0_8px_rgba(255,30,30,0.15)]"
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex flex-col items-start animate-pulse">
            <span className="text-[8px] uppercase tracking-wider text-text-secondaryDark font-telemetry mb-1 leading-none">
              ENGINEER RADIO • SCANNING TELEMETRY MATRIX
            </span>
            <div className="bg-f1-red/5 text-text-secondaryDark border border-f1-red/20 p-2.5 rounded-lg text-xs flex items-center space-x-2">
              <Loader className="w-3.5 h-3.5 animate-spin text-f1-red" />
              <span>Analyzing sector telemetry packets...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {suggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sug)}
            className="text-[9px] font-bold font-telemetry border border-border-light dark:border-border-dark hover:border-f1-red text-text-secondaryDark hover:text-white px-2 py-1 rounded transition-all"
            disabled={loading}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="flex items-center space-x-2 mt-3.5 border-t border-border-light dark:border-border-dark pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Engineer (e.g. 'Why is lap time slower?')..."
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          className="flex-grow bg-black/40 border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-f1-red transition-all"
          disabled={loading}
        />
        <button
          onClick={() => handleSend(input)}
          className="bg-f1-red hover:bg-f1-red/90 text-white p-2 rounded-lg transition-all shadow-[0_0_8px_rgba(255,30,30,0.3)]"
          disabled={loading}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </GlassCard>
  );
}
