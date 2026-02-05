import { motion } from "framer-motion";
import {
  Video,
  Play,
  ShieldCheck,
  Trophy,
  FileSearch,
  BarChart3,
  Headphones,
  MonitorPlay,
  ClipboardList,
  Medal,
  FileText,
  LineChart,
} from "lucide-react";

const features = [
  {
    icon: Video,
    secondaryIcon: Headphones,
    title: "Live Classes",
    description: "Interactive sessions with industry experts via Zoom, Google Meet & more",
    gradient: "from-blue-500 to-cyan-400",
    bgGradient: "from-blue-500/10 to-cyan-400/10",
  },
  {
    icon: MonitorPlay,
    secondaryIcon: Play,
    title: "Recorded Videos",
    description: "Access HD course content anytime, anywhere on any device",
    gradient: "from-purple-500 to-pink-400",
    bgGradient: "from-purple-500/10 to-pink-400/10",
  },
  {
    icon: ShieldCheck,
    secondaryIcon: ClipboardList,
    title: "Secure Exams",
    description: "AI-proctored assessments with integrity & anti-cheating measures",
    gradient: "from-green-500 to-emerald-400",
    bgGradient: "from-green-500/10 to-emerald-400/10",
  },
  {
    icon: Trophy,
    secondaryIcon: Medal,
    title: "Leaderboard",
    description: "Compete with peers and track your ranking in real-time",
    gradient: "from-amber-500 to-orange-400",
    bgGradient: "from-amber-500/10 to-orange-400/10",
  },
  {
    icon: FileSearch,
    secondaryIcon: FileText,
    title: "ATS Resume Score",
    description: "Optimize your resume for job applications with AI analysis",
    gradient: "from-rose-500 to-red-400",
    bgGradient: "from-rose-500/10 to-red-400/10",
  },
  {
    icon: BarChart3,
    secondaryIcon: LineChart,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics",
    gradient: "from-indigo-500 to-violet-400",
    bgGradient: "from-indigo-500/10 to-violet-400/10",
  },
];

const KeyFeatures = () => {
  return (
    <section id="features" className="section-padding bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container-width relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Live Classes, Exams & Mock Tests on{" "}
            <span className="text-accent">AOTMS LMS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need to succeed in your learning journey - from live sessions to career tools
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative bg-card border border-border rounded-2xl p-5 sm:p-6 lg:p-8 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Icon Container */}
                <div className="relative mb-5 sm:mb-6">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={1.5} />
                  </div>
                  {/* Secondary Icon */}
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-card border border-border shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.secondaryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-4 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 md:mt-16 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16"
        >
          {[
            { value: "24/7", label: "Platform Access" },
            { value: "HD", label: "Video Quality" },
            { value: "100%", label: "Secure Exams" },
            { value: "Real-time", label: "Progress Updates" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeatures;