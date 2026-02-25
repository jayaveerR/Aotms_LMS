import { motion } from "framer-motion";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Aditya Krishnan",
    course: "Full Stack Development",
    feedback:
      "AOTMS transformed my career. The live classes and hands-on projects helped me land my dream job at a top tech company.",
    avatar: "AK",
    rating: 5,
  },
  {
    name: "Meera Nair",
    course: "Data Science",
    feedback:
      "The curriculum is perfectly aligned with industry needs. The ATS resume scoring feature was a game-changer for my job search.",
    avatar: "MN",
    rating: 5,
  },
  {
    name: "Sanjay Gupta",
    course: "Cloud Computing",
    feedback:
      "Excellent instructors and comprehensive course material. The secure exam system gave me confidence in my certifications.",
    avatar: "SG",
    rating: 5,
  },
  {
    name: "Lakshmi Devi",
    course: "UI/UX Design",
    feedback:
      "The flexible batch timings allowed me to learn while working. The mentorship even after course completion was invaluable.",
    avatar: "LD",
    rating: 5,
  },
  {
    name: "Ravi Teja",
    course: "DevOps & Cloud",
    feedback:
      "From zero coding knowledge to a cloud engineer in 6 months. AOTMS provided the best structured learning path.",
    avatar: "RT",
    rating: 5,
  },
  {
    name: "Ananya Sharma",
    course: "Python & AI",
    feedback:
      "The leaderboard feature kept me motivated. Competing with peers while learning made the whole experience exciting and productive.",
    avatar: "AS",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden border-t-4 border-black font-['Inter']">
      <div className="absolute inset-0 z-0">
        <AmbientBackground />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      </div>

      <div className="container-width px-4 md:px-8 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#FD5A1A] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white mb-8">
            <Star className="w-4 h-4 fill-white" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Student Reviews
            </span>
          </div>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-black mb-6 uppercase italic leading-[0.9]">
            SUCCESS <br />
            <span className="text-[#0075CF]">STORIES</span>
          </h2>
          <p className="text-black font-bold uppercase tracking-widest text-sm max-w-2xl mx-auto opacity-50">
            Hear from our students who have transformed their careers.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,117,207,1)] hover:shadow-[4px_4px_0px_0px_rgba(253,90,26,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none relative h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-[#0075CF] border-2 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-[#FD5A1A] border border-black rotate-45"
                      />
                    ))}
                  </div>

                  <p className="text-[13px] font-bold text-black/70 leading-relaxed uppercase tracking-wide mb-8 italic">
                    "{testimonial.feedback}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t-4 border-black/10">
                  <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-sm font-black italic shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-black mb-1 italic">
                      {testimonial.name}
                    </h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#0075CF]">
                      {testimonial.course}
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

export default Testimonials;
