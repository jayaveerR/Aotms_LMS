import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, Award, CheckCircle } from "lucide-react";

const outcomes = [
  {
    path: "FULL STACK DEV",
    roles: [
      "Full Stack Developer",
      "Web Developer",
      "Software Engineer",
      "Backend Developer",
    ],
    industries: ["IT Services", "Product Companies", "Startups", "E-commerce"],
    confidence: 95,
  },
  {
    path: "FRONTEND DEV",
    roles: [
      "Frontend Developer",
      "UI Developer",
      "React Developer",
      "Web Designer",
    ],
    industries: ["Digital Agencies", "Tech Companies", "Media", "Fintech"],
    confidence: 92,
  },
  {
    path: "DATA SCIENCE & AI",
    roles: ["Data Scientist", "ML Engineer", "Data Analyst", "AI Developer"],
    industries: ["Healthcare", "Finance", "Retail", "Technology"],
    confidence: 88,
  },
  {
    path: "PYTHON DEV",
    roles: [
      "Python Developer",
      "Backend Developer",
      "Automation Engineer",
      "Django Developer",
    ],
    industries: [
      "Automation",
      "Web Services",
      "Data Companies",
      "Cloud Services",
    ],
    confidence: 90,
  },
];

const CareerOutcomes = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#E9E9E9] relative border-t-4 sm:border-t-8 border-black overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      <div className="container-width px-6 sm:px-8 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase italic mb-4">
            Mission <br />
            <span className="text-[#0075CF]">Outcomes</span>
          </h2>
          <p className="text-black font-bold uppercase tracking-widest text-[10px] sm:text-sm opacity-60 max-w-2xl">
            Identify your target deployment zones and roles after completing the
            protocol.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border-2 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-black uppercase italic leading-tight mb-2">
                    {outcome.path}
                  </h3>
                  <div className="flex items-center gap-1 text-black/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                    Targets Identified
                  </div>
                </div>
                <div className="self-start bg-black text-[#FD5A1A] border-2 border-black px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(253,90,26,0.3)] flex items-center gap-2 rounded-md">
                  <CheckCircle className="w-3 h-3" />
                  {outcome.confidence}% Ready
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-4 h-4 text-[#0075CF]" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                      Deployment Roles
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {outcome.roles.map((role, i) => (
                      <Badge
                        key={i}
                        className="bg-[#E9E9E9] text-black border-2 border-black rounded-lg px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-[#FD5A1A]" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                      Target Sectors
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {outcome.industries.map((industry, i) => (
                      <Badge
                        key={i}
                        className="bg-white text-black border-2 border-black rounded-lg px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,117,207,0.1)]"
                      >
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-black/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-black opacity-30" />
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black/40">
                        Confidence Index
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-sm font-black text-black italic">
                      {outcome.confidence}% verified
                    </span>
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

export default CareerOutcomes;
