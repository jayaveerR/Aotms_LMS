import { motion } from "framer-motion";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import {
  BookOpen,
  Target,
  Users,
  Award,
  CheckCircle,
  Globe,
  TrendingUp,
  MapPin,
  Shield,
  Zap,
  Star,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white font-['Inter'] flex flex-col">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="bg-[#E9E9E9] border-b-8 border-black pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="container-width relative z-10 px-4 sm:px-6 md:px-8 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border-2 border-black shadow-[4px_4px_0px_0px_#0075CF] text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
                <Star className="w-4 h-4 text-[#0075CF]" /> THE_PROTOCOL
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-black leading-[0.9] uppercase italic mb-8">
                ABOUT <span className="text-[#0075CF]">AOTMS</span> <br />
                <span className="text-[#FD5A1A]">LMS</span>
              </h1>
              <p className="text-black font-bold uppercase tracking-widest text-sm lg:text-xl max-w-2xl opacity-60 leading-relaxed">
                We are a premier Learning Management System based in Vijayawada,
                engineering the bridge between education and peak professional
                performance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. Mission Section */}
        <section className="py-24 bg-white relative">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          <div className="container-width px-4 lg:px-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="w-20 h-20 bg-[#E9E9E9] border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_#FD5A1A]">
                  <Target className="w-10 h-10 text-black" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-black uppercase italic">
                  CORE_MISSION_01
                </h2>
                <div className="space-y-6">
                  <p className="text-black font-bold uppercase tracking-widest text-sm opacity-80 leading-relaxed italic border-l-8 border-black pl-6">
                    "Our mission is to democratize access to elite technical
                    education. We transform aspiring students into
                    industry-ready professionals through pure technical
                    dominance."
                  </p>
                  <p className="text-black font-bold text-sm lg:text-base opacity-60">
                    We focus strictly on skill-based and career-oriented
                    education rather than just theoretical knowledge. Real-world
                    learning outcomes are our only metric for success.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#000000] border-4 border-black shadow-[12px_12px_0px_0px_#0075CF] aspect-video relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-20 h-20 text-white/20 group-hover:scale-125 group-hover:text-[#FD5A1A] transition-all duration-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. Offerings Grid */}
        <section className="py-24 bg-[#E9E9E9] border-y-8 border-black relative">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="container-width px-4 lg:px-16 relative z-10">
            <div className="mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-black uppercase italic mb-4">
                SYSTEM <br />
                <span className="text-[#0075CF]">CAPABILITIES</span>
              </h2>
              <p className="text-black font-bold uppercase tracking-widest text-xs opacity-60">
                COMPREHENSIVE TOOLS DESIGNED FOR ABSOLUTE SUCCESS.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: "STRUCTURED_PATHS",
                  desc: "Step-by-step curriculum guided by industry experts to ensure comprehensive skill mastery.",
                },
                {
                  icon: Zap,
                  title: "LIVE_SYNC",
                  desc: "Flexible learning options with interactive live sessions and high-quality recorded library.",
                },
                {
                  icon: CheckCircle,
                  title: "STRESS_TESTS",
                  desc: "Rigorous assessments designed to test your real-world application of knowledge.",
                },
                {
                  icon: TrendingUp,
                  title: "DATA_ANALYTICS",
                  desc: "Detailed analytics and leaderboards to monitor your growth and stay motivated.",
                },
                {
                  icon: Award,
                  title: "ATS_OPTIMIZATION",
                  desc: "Smart tools to optimize your resume for applicant tracking systems and recruiters.",
                },
                {
                  icon: Globe,
                  title: "COLLECTIVE_POWER",
                  desc: "A vibrant community of learners and mentors to support your educational journey.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group"
                >
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6 group-hover:bg-[#FD5A1A] transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-black uppercase italic mb-3 tracking-tighter">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Target Audience */}
        <section className="py-24 bg-white">
          <div className="container-width px-4 lg:px-16">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-black uppercase italic mb-4">
                AUTHORIZED <br />
                <span className="text-[#FD5A1A]">OPERATIVES</span>
              </h2>
              <p className="text-black font-bold uppercase tracking-widest text-xs opacity-60 max-w-md mx-auto">
                OUR PLATFORM CATER TO THE MOST AMBITIOUS ARCHITECTS OF THE
                FUTURE.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "STUDENTS",
                  desc: "Building core architecture alongside academic protocols.",
                },
                {
                  title: "GRADUATES",
                  desc: "Immediate deployment of job-ready skillsets.",
                },
                {
                  title: "PROS",
                  desc: "Strategic upskilling through convenient learning nodes.",
                },
                {
                  title: "MENTORS",
                  desc: "Expert architects sharing knowledge to impact future cycles.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-4 border-black p-8 text-center shadow-[4px_4px_0px_0px_#0075CF] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <div className="w-16 h-16 mx-auto bg-[#E9E9E9] border-2 border-black flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-black text-black uppercase italic mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Local Presence */}
        <section className="py-24 bg-black relative border-y-8 border-[#FD5A1A] overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="container-width relative z-10 px-4 lg:px-16">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6 text-[#FD5A1A]">
                  <MapPin className="w-6 h-6" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">
                    GEOGRAPHICAL_ANCHOR
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic mb-8 leading-tight">
                  DOMINATING FROM <br />
                  <span className="text-[#0075CF]">VIJAYAWADA</span>
                </h2>
                <p className="text-white/60 font-bold uppercase tracking-widest text-sm lg:text-base leading-relaxed max-w-xl">
                  While we operate as a digital-first global learning
                  collective, our core development node is located in
                  Vijayawada. We are proud to fuel the city's educational
                  evolution.
                </p>
              </div>
              <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_#FD5A1A]">
                <h4 className="text-xl font-black text-black uppercase italic mb-4">
                  NODE_LOCATION
                </h4>
                <p className="text-black font-bold uppercase tracking-widest text-xs leading-loose">
                  AURAM CREATIVE CENTER, 19TH FLOOR <br />
                  VIJAYAWADA, ANDHRA PRADESH <br />
                  INDIA - 520001
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Why Choose Us */}
        <section className="py-24 bg-white relative">
          <div className="container-width px-4 lg:px-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-black uppercase italic mb-10">
                  SYSTEM_ADVANTAGES
                </h2>
                <div className="space-y-10">
                  {[
                    {
                      title: "CAREER_CORE",
                      desc: "WE DON'T TEACH TOPICS; WE PREPARE YOU FOR SPECIFIC ROLES.",
                    },
                    {
                      title: "PERFORMANCE_SYNC",
                      desc: "TOUGH ASSESSMENTS THAT GUARANTEE DOMINANCE.",
                    },
                    {
                      title: "VERIFIED_DATA",
                      desc: "STRICT VERIFICATION FOR ALL INSTRUCTORS AND CONTENT.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-6">
                      <div className="shrink-0 w-10 h-10 bg-black text-white flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-black uppercase italic mb-2 tracking-tighter">
                          {item.title}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#E9E9E9] border-4 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FD5A1A] border-4 border-black flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform">
                  <Star className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-black text-black uppercase italic mb-8">
                  TELEMETRY_DATA
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border-b-2 border-black/10">
                    <span className="text-xs font-black uppercase tracking-widest">
                      PLACEMENT_RATE
                    </span>
                    <span className="text-2xl font-black text-[#0075CF]">
                      85%+
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b-2 border-black/10">
                    <span className="text-xs font-black uppercase tracking-widest">
                      SATISFACTION_INDEX
                    </span>
                    <span className="text-2xl font-black text-[#0075CF]">
                      4.8/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black text-white">
                    <span className="text-xs font-black uppercase tracking-widest">
                      PRACTICAL_FOCUS_NODES
                    </span>
                    <span className="text-2xl font-black text-[#FD5A1A]">
                      100%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
