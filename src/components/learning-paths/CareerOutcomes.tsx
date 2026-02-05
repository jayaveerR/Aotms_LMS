import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, Award, CheckCircle } from "lucide-react";

const outcomes = [
  {
    path: "Full Stack Developer",
    roles: ["Full Stack Developer", "Web Developer", "Software Engineer", "Backend Developer"],
    industries: ["IT Services", "Product Companies", "Startups", "E-commerce"],
    confidence: 95,
  },
  {
    path: "Frontend Developer",
    roles: ["Frontend Developer", "UI Developer", "React Developer", "Web Designer"],
    industries: ["Digital Agencies", "Tech Companies", "Media", "Fintech"],
    confidence: 92,
  },
  {
    path: "Data Science & AI",
    roles: ["Data Scientist", "ML Engineer", "Data Analyst", "AI Developer"],
    industries: ["Healthcare", "Finance", "Retail", "Technology"],
    confidence: 88,
  },
  {
    path: "Python Developer",
    roles: ["Python Developer", "Backend Developer", "Automation Engineer", "Django Developer"],
    industries: ["Automation", "Web Services", "Data Companies", "Cloud Services"],
    confidence: 90,
  },
];

const CareerOutcomes = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-sky-700 mb-4">
            Career Outcomes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the job roles and industries you can target after completing each learning path
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-medium transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading text-xl text-foreground">{outcome.path}</h3>
                  <p className="text-sm text-muted-foreground">Roles you can apply for</p>
                </div>
                <div className="flex items-center gap-1 text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{outcome.confidence}% Ready</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    <span className="text-sm font-medium text-foreground">Job Roles</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {outcome.roles.map((role, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">Target Industries</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {outcome.industries.map((industry, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">
                      Skill confidence level: <span className="font-semibold text-foreground">{outcome.confidence}%</span>
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
