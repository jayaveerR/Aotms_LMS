import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "👋 Hi there! I'm your AOTMS learning assistant. How can I help you accelerate your career today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track mobile breakpoint
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleScroll = () => {
    if (chatAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatAreaRef.current;
      setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 100);
      setShowScrollTop(scrollTop > 200);
    }
  };

  const scrollToTop = () => {
    chatAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hide widget when footer enters viewport
  useEffect(() => {
    const footer = document.getElementById("contact");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
        if (entry.isIntersecting) setIsOpen(false);
      },
      { threshold: 0.05 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

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
    if (e.key === "Enter") handleSend();
  };

  const quickReplies = ["Explore Courses", "Placement Info", "Fee Details"];

  // Compute chatbot window position/size based on screen size
  const chatWindowStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        bottom: "88px",
        left: "12px",
        right: "12px",
        width: "auto",
        height: "500px",
        maxHeight: "calc(100vh - 140px)",
        zIndex: 60,
        boxShadow: "6px 6px 0px 0px rgba(31,31,31,1)",
      }
    : {
        position: "fixed",
        bottom: "96px",
        right: "24px",
        width: "380px",
        height: "500px",
        maxHeight: "calc(100vh - 140px)",
        zIndex: 60,
        boxShadow: "12px 12px 0px 0px rgba(0,117,207,1)",
      };

  return (
    <>
      {/* Chatbot Window */}
      <div
        style={chatWindowStyle}
        className={`bg-white border-4 border-black transition-all duration-300 origin-bottom-right flex flex-col overflow-hidden rounded-3xl ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0 translate-x-0"
            : "scale-50 opacity-0 translate-y-10 translate-x-10 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-black p-4 text-white relative flex items-center gap-3 shrink-0 border-b-4 border-black rounded-3xl">
          <div className="relative">
            <div className="w-10 h-10 bg-white border-2 border-white flex items-center justify-center rounded-3xl">
              <Bot className="w-6 h-6 text-black rounded-3xl" />
            </div>
          </div>
          <div className="flex-1 min-w-0 rounded-3xl">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 italic">
              AOTMS AI{" "}
              <Sparkles className="w-4 h-4 text-[#FD5A1A] shrink-0 rounded-3xl" />
            </h3>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">
              NEURAL_LINK: ACTIVE
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 shrink-0 border-2 border-white/20 hover:border-white hover:bg-white hover:text-black flex items-center justify-center transition-all bg-transparent rounded-3xl"
          >
            <X className="w-5 h-5 rounded-3xl" />
          </button>
        </div>

        {/* Chat Area */}
        <div
          ref={chatAreaRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#E9E9E9] rounded-3xl relative transition-all"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 max-w-[90%] ${
                msg.type === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 shrink-0 border-2 border-black flex items-center justify-center text-xs ${
                  msg.type === "user"
                    ? "bg-[#FD5A1A] text-white"
                    : "bg-[#0075CF] text-white"
                } rounded-3xl`}
              >
                {msg.type === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`p-3 text-[12px] font-bold leading-relaxed uppercase tracking-wide min-w-0 ${
                  msg.type === "user"
                    ? "bg-[#FD5A1A] text-white border-2 border-black"
                    : "bg-white text-black border-2 border-black"
                } rounded-3xl`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />

          {/* Internal Scroll Buttons */}
          <div className="sticky bottom-2 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none pb-2">
            {showScrollBottom && (
              <button
                onClick={scrollToBottom}
                className="pointer-events-auto p-2 bg-black text-white border-2 border-white hover:bg-[#FD5A1A] transition-all rounded-3xl animate-bounce"
                title="Scroll to Bottom"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            )}
            {showScrollTop && !showScrollBottom && (
              <button
                onClick={scrollToTop}
                className="pointer-events-auto p-2 bg-black text-white border-2 border-white hover:bg-[#0075CF] transition-all rounded-3xl"
                title="Scroll to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Replies */}
        {messages.length > 0 &&
          messages[messages.length - 1].type === "bot" && (
            <div
              className="bg-[#E9E9E9] px-4 pb-3 flex gap-2 overflow-x-auto shrink-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => {
                    setInputValue(reply);
                    setTimeout(() => handleSend(), 50);
                  }}
                  className="shrink-0 px-3 py-2 bg-white border-2 border-black text-black text-[9px] font-black uppercase tracking-widest hover:translate-x-[1px] hover:translate-y-[1px] transition-all rounded-3xl"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

        {/* Input Area */}
        <div className="p-3 bg-white border-t-4 border-black shrink-0 rounded-3xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="TYPE_HERE..."
              className="flex-1 min-w-0 h-12 bg-[#E9E9E9] border-2 border-black text-black placeholder:text-black/20 font-black uppercase tracking-widest px-3 focus:outline-none focus:border-[#FD5A1A] text-xs rounded-3xl"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 transition-all ${
                inputValue.trim()
                  ? "bg-[#FD5A1A] text-white hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-[9px] text-black font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              POWERED_BY:{" "}
              <span className="text-[#0075CF]">AOTMS_ENGINE_V2</span>
            </span>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 50,
          width: isOpen ? "56px" : isMobile ? "56px" : "140px",
          height: "56px",
          opacity: footerVisible ? 0 : 1,
          pointerEvents: footerVisible ? "none" : "auto",
          transform: footerVisible ? "translateY(32px)" : "translateY(0)",
        }}
        className={`flex items-center justify-center transition-all duration-300 ease-out overflow-hidden border-4 border-black rounded-3xl ${
          isOpen
            ? "bg-white text-black rotate-90"
            : "bg-black text-white shadow-[6px_6px_0px_0px_rgba(253,90,26,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,117,207,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-none"
        }`}
      >
        {isOpen ? (
          <X className="w-8 h-8 -rotate-90 rounded-3xl" strokeWidth={3} />
        ) : (
          <div className="flex items-center gap-3 px-3 w-full h-full justify-center rounded-3xl">
            <MessageSquare className="w-6 h-6 fill-[#FD5A1A] stroke-black shrink-0 rounded-3xl" />
            {!isMobile && (
              <span className="font-black text-xs tracking-widest uppercase italic whitespace-nowrap">
                ASK AI
              </span>
            )}
          </div>
        )}
      </button>
    </>
  );
};

export default ChatbotWidget;
