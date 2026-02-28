import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Loader2, User, Bot } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  patientId: string;
  patientName: string;
}

const PatientChat = ({ patientId, patientName }: Props) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userQuery }]);
    setLoading(true);

    try {
      const { response } = await api.chat(patientId, userQuery);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Failed to get response from AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground text-sm">Ask AI about {patientName}</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center mt-8">
            Ask questions about the patient's medical history...
          </p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`p-2 rounded-lg h-fit ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-muted text-foreground rounded-tl-none prose prose-sm max-w-none"
              }`}>
                {msg.role === "assistant" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-3">
            <div className="p-2 rounded-lg bg-accent h-fit">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-muted rounded-2xl p-3 rounded-tl-none">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about the patient..."
            className="flex-1"
            disabled={loading}
          />
          <Button 
            type="submit"
            disabled={loading || !input.trim()} 
            size="icon" 
            className="healthcare-gradient text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PatientChat;
