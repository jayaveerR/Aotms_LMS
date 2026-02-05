import { motion } from "framer-motion";
import { Monitor, User, Search, Pencil, BookOpen, Award } from "lucide-react";
import logoImage from "@/assets/logo.png";

const icons = [
  { icon: Monitor, angle: -60 },
  { icon: User, angle: -20 },
  { icon: Search, angle: 20 },
  { icon: Pencil, angle: 60 },
];

const features = [
  {
    number: "01",
    title: "Live Classes",
    description: "Interactive sessions with industry experts for real-time learning",
    gradient: "from-pink-500 to-rose-500",
    shadowColor: "shadow-pink-500/30",
  },
  {
    number: "02",
    title: "Digital Resources",
    description: "Access comprehensive study materials and recorded lectures anytime",
    gradient: "from-cyan-500 to-teal-500",
    shadowColor: "shadow-cyan-500/30",
  },
  {
    number: "03",
    title: "Career Growth",
    description: "Job placement support and resume optimization for your success",
    gradient: "from-green-500 to-emerald-500",
    shadowColor: "shadow-green-500/30",
  },
];

const WhyAOTMS = () => {
  return (
    <section id="about" className="section-padding bg-muted/30 overflow-hidden">
      <div className="container-width">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Why Choose <span className="text-accent">AOTMS?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the future of learning with our innovative platform
          </p>
        </motion.div>

        {/* Semi-circular Icon Layout */}
        <div className="relative flex justify-center mb-20">
          <div className="relative w-[320px] h-[180px] md:w-[450px] md:h-[250px] lg:w-[550px] lg:h-[300px]">
            {/* Arc Background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Semi-circle segments */}
              {icons.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="absolute"
                  style={{
                    left: '50%',
                    bottom: '0',
                    transformOrigin: 'center bottom',
                    transform: `translateX(-50%) rotate(${item.angle}deg)`,
                  }}
                >
                  {/* Petal/Segment shape */}
                  <div 
                    className="relative w-16 h-24 md:w-24 md:h-36 lg:w-28 lg:h-40 -translate-x-1/2"
                    style={{ transformOrigin: 'center bottom' }}
                  >
                    <div className="absolute inset-0 bg-card rounded-t-full shadow-lg border border-border/50 flex items-center justify-center pt-2 md:pt-4 cursor-target hover:bg-accent/5 transition-colors duration-300">
                      <motion.div
                        style={{ transform: `rotate(${-item.angle}deg)` }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <item.icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Center Circle with Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
            >
              <div className="relative">
                {/* Animated ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full border-2 border-dashed border-primary/30"
                />
                {/* Progress dots on ring */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <motion.div
                    key={deg}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="absolute w-2 h-2 rounded-full bg-accent"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-${56}px) md:translateY(-${72}px)`,
                    }}
                  />
                ))}
                {/* Inner circle with logo */}
                <div className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full bg-card shadow-xl border border-border flex items-center justify-center">
                  <div className="text-center p-2">
                    <img src={logoImage} alt="AOTMS Logo" className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto object-contain" />
                    <p className="text-[8px] md:text-[10px] lg:text-xs text-muted-foreground mt-1 font-medium">AOTMS</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Spacer for center circle overflow */}
        <div className="h-16 md:h-20 lg:h-24" />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
              className="group cursor-target"
            >
              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border hover:shadow-lg transition-all duration-300 h-full">
                <div className="flex items-start gap-4">
                  {/* Gradient Number Circle */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg ${feature.shadowColor}`}
                  >
                    <span className="text-white font-bold text-lg md:text-xl">{feature.number}</span>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-foreground text-lg md:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAOTMS;
