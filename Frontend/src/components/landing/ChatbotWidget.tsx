import { useState, useRef, useEffect } from "react";
import {
  Check,
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "👋 Hi there! I'm your AOTMS learning assistant. How can I help you accelerate your career today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot thinking and responding based on simple keywords
    setTimeout(() => {
      let botResponse =
        "Our team will get back to you with more details perfectly matched to your query. Feel free to ask anything else!";

      const lowerInput = userMessage.text.toLowerCase();
      if (lowerInput.includes("course") || lowerInput.includes("learn")) {
        botResponse =
          "We offer a wide range of career-focused courses including Full Stack Development, Data Science, and UI/UX Design! Which one interests you?";
      } else if (
        lowerInput.includes("price") ||
        lowerInput.includes("fee") ||
        lowerInput.includes("cost")
      ) {
        botResponse =
          "Our courses are affordably priced with easy EMI options. Merit-based scholarships are also available up to 30%.";
      } else if (
        lowerInput.includes("placement") ||
        lowerInput.includes("job")
      ) {
        botResponse =
          "We provide 100% placement assistance, including mock interviews and resume building (ATS scoring)! We have placed 2000+ students.";
      } else if (lowerInput.includes("hi") || lowerInput.includes("hello")) {
        botResponse = "Hello! Ready to transform your career with AOTMS?";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: botResponse,
        },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const quickReplies = ["Explore Courses", "Placement Info", "Fee Details"];

  return (
    <>
      {/* Chatbot Window */}
      <div
        className={`fixed bottom-24 right-6 z-[60] w-[390px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-2 border-[#E9E9E9] overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0 translate-x-0"
            : "scale-50 opacity-0 translate-y-10 translate-x-10 pointer-events-none"
        }`}
        style={{ height: "500px", maxHeight: "calc(100vh - 120px)" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0075CF] to-[#005fa3] p-4 text-white relative flex items-center gap-3 shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm shadow-inner">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#005fa3]"></div>
          </div>
          <div>
            <h3 className="font-heading text-lg leading-tight flex items-center gap-1">
              AOTMS Assistant <Sparkles className="w-3 h-3 text-yellow-300" />
            </h3>
            <p className="text-white/70 text-xs font-medium">
              Online | usually replies instantly
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc] scrollbar-thin scrollbar-thumb-gray-200">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 max-w-[85%] ${
                msg.type === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs shadow-sm ${
                  msg.type === "user"
                    ? "bg-[#FD5A1A] text-white"
                    : "bg-[#0075CF] text-white"
                }`}
              >
                {msg.type === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`p-3 text-sm leading-relaxed shadow-sm ${
                  msg.type === "user"
                    ? "bg-[#FD5A1A] text-white rounded-2xl rounded-tr-sm"
                    : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies (Only show if last message is from bot) */}
        {messages.length > 0 &&
          messages[messages.length - 1].type === "bot" && (
            <div className="bg-[#f8fafc] px-4 pb-2 flex gap-2 overflow-x-auto hide-scrollbar shrink-0">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => {
                    setInputValue(reply);
                    setTimeout(() => handleSend(), 50);
                  }}
                  className="shrink-0 px-3 py-1.5 bg-white border border-[#0075CF]/20 text-[#0075CF] text-xs font-medium rounded-full shadow-sm hover:bg-[#0075CF]/5 hover:border-[#0075CF] transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <div className="relative flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 p-1 pr-2 shadow-inner focus-within:border-[#0075CF]/50 focus-within:ring-2 focus-within:ring-[#0075CF]/10 transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm px-3 py-2 text-gray-700 placeholder:text-gray-800"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                inputValue.trim()
                  ? "bg-[#FD5A1A] text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-800 flex items-center justify-center gap-1 font-medium">
              Powered by AOTMS AI <Check className="w-3 h-3 text-[#0075CF]" />
            </span>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center
          rounded-2xl shadow-[0_8px_30px_rgba(0,117,207,0.4)]
          transition-all duration-300 ease-out group overflow-hidden
          border-2 border-white/20 hover:border-white/40
          ${isOpen ? "w-14 h-14 bg-white text-gray-800 rotate-90 scale-90" : "w-[110px] h-12 bg-gradient-to-r from-[#0075CF] to-[#005fa3] text-white hover:shadow-[0_10px_40px_rgba(0,117,207,0.6)] hover:-translate-y-1 active:scale-95"}`}
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />

        {isOpen ? (
          <X
            className="w-6 h-6 -rotate-90 transition-transform duration-500"
            strokeWidth={2.5}
          />
        ) : (
          <div className="flex items-center gap-3 px-4 w-full h-full">
            <div className="relative shrink-0">
              <MessageSquare
                className="w-6 h-6"
                fill="currentColor"
                fillOpacity={0.2}
              />
              <div className="absolute top-0 -right-1 w-2.5 h-2.5 bg-[#FD5A1A] rounded-full border border-[#005fa3] animate-pulse" />
            </div>
            <span
              className="font-sans text-sm font-bold tracking-widest whitespace-nowrap overflow-hidden"
              style={{ textShadow: "none" }}
            >
              CHAT
            </span>
          </div>
        )}
      </button>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;
