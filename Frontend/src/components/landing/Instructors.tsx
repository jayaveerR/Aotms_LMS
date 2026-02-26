import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const instructors = [
  {
    name: "Dr. Rajesh Kumar",
    expertise: "Full Stack Development",
    experience: "15+ Years",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Priya Menon",
    expertise: "Data Science & AI",
    experience: "12+ Years",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Amit Sharma",
    expertise: "Cloud & DevOps",
    experience: "10+ Years",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Sneha Reddy",
    expertise: "UI/UX Design",
    experience: "8+ Years",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  },
];

const Instructors = () => {
  return (
    <section className="py-24 md:py-32 bg-[#E9E9E9] relative overflow-hidden font-['Inter']">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      <div className="container-width px-4 md:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#FD5A1A] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white mb-8">
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Expert Mentors
            </span>
          </div>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-black mb-6 uppercase italic leading-[0.9]">
            LEARN FROM <br />
            <span className="text-[#0075CF]">THE BEST</span>
          </h2>
          <p className="text-black font-bold uppercase tracking-widest text-sm max-w-2xl mx-auto opacity-50">
            Industry professionals with 10+ years of experience in top tech
            firms.
          </p>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(253,90,26,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all group overflow-hidden rounded-none">
                {/* Image */}
                <div className="relative h-64 border-b-4 border-black overflow-hidden bg-black/5">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  />

                  {/* Experience badge */}
                  <div className="absolute top-0 right-0 px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest border-l-4 border-b-4 border-white shadow-none">
                    {instructor.experience} EXP
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tight italic">
                    {instructor.name}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-[#E9E9E9] border-2 border-black font-black text-[9px] uppercase tracking-widest mb-4">
                    {instructor.expertise}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#0075CF] group-hover:translate-x-2 transition-transform">
                    View Profile <ArrowRight className="w-4 h-4" />
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

export default Instructors;
