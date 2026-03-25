import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import FAQSection from "@/components/landing/FAQSection";
import LowPolyBackground from "@/components/landing/LowPolyBackground";

const FAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Shared global background */}
      <LowPolyBackground />

      <div className="relative z-10 w-full">
        {/* White Lift System for text readability */}
        <div className="absolute inset-0 bg-white/10 -z-10" />
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 80%, transparent 100%)",
          }}
        />

        <Header />

        <main>
          {/* ── Page Hero ─────────────────────────────────────────────────── */}
          <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">

            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-[#0075CF]/20 backdrop-blur-sm text-[#0075CF] text-xs font-black uppercase tracking-[0.2em] mb-6"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Knowledge Base
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight"
              >
                Frequently Asked{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0075CF] to-[#3391D9]">
                  Questions
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-900 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
              >
                Everything you need to know about AOTMS — admissions, training,
                placements, fees, and more. Can't find an answer?{" "}
                <a
                  href="mailto:hello@aotms.com"
                  className="text-[#0075CF] underline underline-offset-2 hover:text-[#FD5A1A] transition-colors"
                >
                  Contact us.
                </a>
              </motion.p>
            </div>
          </section>

          {/* ── FAQ Accordion ─────────────────────────────────────────────── */}
          <FAQSection />

          {/* ── Still have questions CTA ───────────────────────────────────── */}
          <section className="py-16 md:py-24 relative">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-[2rem] bg-white/50 backdrop-blur-md border border-slate-200/60 shadow-xl p-10 md:p-14"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0075CF]/10 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-7 h-7 text-[#0075CF]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">
                  Still have questions?
                </h2>
                <p className="text-slate-600 font-medium mb-8 leading-relaxed">
                  Our counselors are available Mon–Sat, 9am–7pm IST to help you
                  make the right decision for your career.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate("/auth")}
                    className="group flex items-center gap-2 h-12 px-8 rounded-2xl bg-gradient-to-r from-[#0075CF] to-[#3391D9] text-white font-bold text-sm shadow-lg shadow-[#0075CF]/20 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Talk to a Counselor
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a
                    href="mailto:hello@aotms.com"
                    className="flex items-center gap-2 h-12 px-8 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm"
                  >
                    Email Us
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default FAQ;
