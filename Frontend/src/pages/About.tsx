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

      <main className="flex-1 overflow-x-hidden">
        {/* 1. Hero Section */}
        <section className="bg-[#E9E9E9] border-b-4 sm:border-b-8 border-black pt-24 sm:pt-32 pb-16 sm:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="container-width relative z-10 px-6 sm:px-8 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black border-2 border-black shadow-[3px_3px_0px_0px_#0075CF] text-white text-[9px] sm:text-xs font-black uppercase tracking-widest mb-6 px-4">
                <Star className="w-3.5 h-3.5 text-[#0075CF]" /> The Protocol
              </div>
              <h1 className="text-4xl sm:text-7xl lg:text-9xl font-black text-black leading-[1.1] sm:leading-[0.9] uppercase italic mb-6 sm:mb-8">
                About <span className="text-[#0075CF]">AOTMS</span>{" "}
                <br className="sm:block hidden" />
                <span className="text-[#FD5A1A]">LMS</span>
              </h1>
              <p className="text-black font-bold uppercase tracking-[0.1em] text-[11px] sm:text-sm lg:text-xl max-w-2xl opacity-60 leading-relaxed">
                Engineering the bridge between technical education and peak
                professional performance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. Mission Section */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          <div className="container-width px-6 sm:px-8 lg:px-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#E9E9E9] border-2 sm:border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#FD5A1A]">
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase">
                  Core Mission
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-black font-bold uppercase tracking-widest text-xs sm:text-sm opacity-80 leading-relaxed italic border-l-4 sm:border-l-8 border-black pl-4 sm:pl-6">
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
                className="bg-[#000000] border-2 sm:border-4 border-black shadow-[8px_8px_0px_0px_#0075CF] sm:shadow-[12px_12px_0px_0px_#0075CF] aspect-video relative overflow-hidden group rounded-lg sm:rounded-none"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-16 h-16 sm:w-20 sm:h-20 text-white/20 group-hover:scale-125 group-hover:text-[#FD5A1A] transition-all duration-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. Offerings Grid */}
        <section className="py-16 sm:py-24 bg-[#E9E9E9] border-y-4 sm:border-y-8 border-black relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="container-width px-6 sm:px-8 lg:px-16 relative z-10">
            <div className="mb-12 sm:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase italic mb-4">
                System <br />
                <span className="text-[#0075CF]">Capabilities</span>
              </h2>
              <p className="text-black font-bold uppercase tracking-widest text-[10px] sm:text-xs opacity-60">
                Comprehensive tools designed for absolute success.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: BookOpen,
                  title: "Structured Paths",
                  desc: "Step-by-step curriculum guided by industry experts to ensure comprehensive skill mastery.",
                },
                {
                  icon: Zap,
                  title: "Live Sync",
                  desc: "Flexible learning options with interactive live sessions and high-quality recorded library.",
                },
                {
                  icon: CheckCircle,
                  title: "Stress Tests",
                  desc: "Rigorous assessments designed to test your real-world application of knowledge.",
                },
                {
                  icon: TrendingUp,
                  title: "Data Analytics",
                  desc: "Detailed analytics and leaderboards to monitor your growth and stay motivated.",
                },
                {
                  icon: Award,
                  title: "ATS Optimization",
                  desc: "Smart tools to optimize your resume for applicant tracking systems and recruiters.",
                },
                {
                  icon: Globe,
                  title: "Collective Power",
                  desc: "A vibrant community of learners and mentors to support your educational journey.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border-2 sm:border-4 border-black p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group rounded-xl"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded flex items-center justify-center mb-6 group-hover:bg-[#FD5A1A] transition-colors shadow-[2px_2px_0px_0px_rgba(253,90,26,0.3)]">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-black uppercase italic mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/50 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Target Audience */}
        <section className="py-16 sm:py-24 bg-white overflow-hidden">
          <div className="container-width px-6 sm:px-8 lg:px-16">
            <div className="text-center mb-12 sm:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase italic mb-4">
                Authorized <br />
                <span className="text-[#FD5A1A]">Operatives</span>
              </h2>
              <p className="text-black font-bold uppercase tracking-widest text-[10px] sm:text-xs opacity-60 max-w-md mx-auto">
                Our platform caters to the most ambitious architects of the
                future.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  title: "Students",
                  desc: "Building core architecture alongside academic protocols.",
                },
                {
                  title: "Graduates",
                  desc: "Immediate deployment of job-ready skillsets.",
                },
                {
                  title: "Pros",
                  desc: "Strategic upskilling through convenient learning nodes.",
                },
                {
                  title: "Mentors",
                  desc: "Expert architects sharing knowledge to impact future cycles.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-2 sm:border-4 border-black p-6 sm:p-8 text-center shadow-[3px_3px_0px_0px_#0075CF] sm:shadow-[4px_4px_0px_0px_#0075CF] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-xl"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-[#E9E9E9] border-2 border-black flex items-center justify-center mb-6 rounded-lg">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-black uppercase italic mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Local Presence */}
        <section className="py-16 sm:py-24 bg-black relative border-y-4 sm:border-y-8 border-[#FD5A1A] overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="container-width relative z-10 px-6 sm:px-8 lg:px-16">
            <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6 text-[#FD5A1A]">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                    Geographical Anchor
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase italic mb-6 sm:mb-8 leading-tight">
                  Dominating from <br className="sm:hidden" />
                  <span className="text-[#0075CF]">Vijayawada</span>
                </h2>
                <p className="text-white/60 font-bold uppercase tracking-widest text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                  While we operate as a digital-first global learning
                  collective, our core development node is located in
                  Vijayawada. We are proud to fuel the city's educational
                  evolution.
                </p>
              </div>
              <div className="bg-white border-2 sm:border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_#FD5A1A] sm:shadow-[12px_12px_0px_0px_#FD5A1A] rounded-xl sm:rounded-none">
                <h4 className="text-lg sm:text-xl font-black text-black uppercase italic mb-4">
                  Node Location
                </h4>
                <p className="text-black font-bold uppercase tracking-widest text-[10px] sm:text-xs leading-loose">
                  AURAM CREATIVE CENTER, 19TH FLOOR <br />
                  VIJAYAWADA, ANDHRA PRADESH <br />
                  INDIA - 520001
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Why Choose Us */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
          <div className="container-width px-6 sm:px-8 lg:px-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase italic mb-8 sm:mb-10">
                  System Advantages
                </h2>
                <div className="space-y-8 sm:space-y-10">
                  {[
                    {
                      title: "Career Core",
                      desc: "We don't teach topics; we prepare you for specific roles.",
                    },
                    {
                      title: "Performance Sync",
                      desc: "Tough assessments that guarantee dominance.",
                    },
                    {
                      title: "Verified Data",
                      desc: "Strict verification for all instructors and content.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 sm:gap-6">
                      <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 border-2 border-black bg-black text-white flex items-center justify-center rounded">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-black uppercase italic mb-1 sm:mb-2 tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/50 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#E9E9E9] border-2 sm:border-4 border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative rounded-2xl">
                <div className="absolute -top-6 -right-4 sm:-top-10 sm:-right-10 w-16 h-16 sm:w-24 sm:h-24 bg-[#FD5A1A] border-2 sm:border-4 border-black flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform rounded-xl">
                  <Star className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-black uppercase italic mb-6 sm:mb-8">
                  Telemetry Data
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between p-3 sm:p-4 border-b-2 border-black/10">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                      Placement Rate
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#0075CF]">
                      85%+
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 border-b-2 border-black/10">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                      Satisfaction Index
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#0075CF]">
                      4.8/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black text-white rounded-lg">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                      Practical Focus Nodes
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#FD5A1A]">
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
