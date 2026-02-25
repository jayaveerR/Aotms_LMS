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
    <section className="py-24 bg-[#E9E9E9] relative border-t-8 border-black">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      <div className="container-width px-4 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase italic mb-4">
            MISSION <br />
            <span className="text-[#0075CF]">OUTCOMES</span>
          </h2>
          <p className="text-black font-bold uppercase tracking-widest text-sm opacity-60 max-w-2xl">
            Identify your target deployment zones and roles after completing the
            protocol.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_#FD5A1A] transition-all group"
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-black uppercase italic leading-none mb-2">
                    {outcome.path}
                  </h3>
                  <div className="flex items-center gap-1 text-black/40 text-[10px] font-black uppercase tracking-widest">
                    TARGET_ROLES_IDENTIFIED
                  </div>
                </div>
                <div className="bg-black text-[#FD5A1A] border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(253,90,26,0.5)] flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  {outcome.confidence}%_READY
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-4 h-4 text-black" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      DEPLOYMENT_ROLES
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {outcome.roles.map((role, i) => (
                      <Badge
                        key={i}
                        className="bg-[#E9E9E9] text-black border-2 border-black rounded-none px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-black" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      TARGET_SECTORS
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {outcome.industries.map((industry, i) => (
                      <Badge
                        key={i}
                        className="bg-white text-black border-2 border-black rounded-none px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#0075CF]"
                      >
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-dashed border-black/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-black" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
                        CONFIDENCE_INDEX
                      </span>
                    </div>
                    <span className="text-sm font-black text-black italic">
                      {outcome.confidence}%_VERIFIED
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
