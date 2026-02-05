import { motion } from "framer-motion";

const stats = [
  {
    number: 1,
    percentage: "95%",
    title: "Course Completion Rate",
    description: "Our students complete courses with high engagement and retention through interactive learning",
    color: "bg-primary border-primary",
  },
  {
    number: 2,
    percentage: "89%",
    title: "Job Placement Success",
    description: "Graduates securing positions in top companies within 3 months of course completion",
    color: "bg-accent border-accent",
  },
  {
    number: 3,
    percentage: "92%",
    title: "Student Satisfaction",
    description: "Learners rate their experience as excellent with our expert instructors and curriculum",
    color: "bg-amber-500 border-amber-500",
  },
];

const WhyAOTMS = () => {
  return (
    <section id="about" className="bg-background">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] rounded-3xl overflow-hidden shadow-xl">
          {/* Left Side - Dark Background */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6"
              >
                Why
                <br />
                Choose
                <br />
                <span className="text-primary">AOTMS?</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-white/70 text-lg md:text-xl font-medium"
              >
                The numbers speak
                <br />
                for themselves.
              </motion.p>
            </div>
          </motion.div>

          {/* Right Side - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card p-8 md:p-12 lg:p-16 flex flex-col justify-center relative"
          >
            <div className="space-y-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                  className="flex items-start gap-6 group"
                >
                  {/* Number Circle */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${stat.color} flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-lg border-4 border-white ring-4 ring-offset-0 ${stat.color.split(' ')[1]}/30 group-hover:scale-110 transition-transform duration-300`}>
                      {stat.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-foreground text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      <span className="text-primary">{stat.percentage}</span> {stat.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyAOTMS;
