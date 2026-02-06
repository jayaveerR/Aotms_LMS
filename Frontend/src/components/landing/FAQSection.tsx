import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GraduationCap, BookOpen, Briefcase, Award, Wrench, MapPin, HeadphonesIcon } from "lucide-react";

const faqCategories = [
  {
    title: "Admissions & Enrollment",
    icon: GraduationCap,
    questions: [
      { q: "What is the eligibility criteria for joining AOTMS courses?", a: "We welcome students from all educational backgrounds. Basic computer knowledge is helpful but not mandatory. Our courses are designed to take you from beginner to job-ready." },
      { q: "Do I need a technical background to join?", a: "No, technical background is not required. Our curriculum is designed for complete beginners and we start from the fundamentals." },
      { q: "How do I register for a course?", a: "You can register online through our website or visit our Vijayawada campus. Our counselors will guide you through the enrollment process." },
      { q: "Can I join if I have a career gap?", a: "Absolutely! Many of our successful students had career gaps. We focus on skills and dedication, not gaps in your resume." },
      { q: "Do I need to bring my own laptop?", a: "We provide fully equipped computer labs. However, having your own laptop helps with practice at home." },
      { q: "What is the batch size?", a: "We maintain small batch sizes of 15-20 students to ensure personalized attention and better learning outcomes." },
      { q: "Can I switch batches if needed?", a: "Yes, batch switching is allowed based on availability. Contact our admin team to arrange a transfer." },
    ],
  },
  {
    title: "Training & Curriculum",
    icon: BookOpen,
    questions: [
      { q: "Are the classes online or offline?", a: "We offer both online and offline modes. You can choose based on your convenience and location." },
      { q: "Do you provide hands-on project experience?", a: "Yes! Every course includes 3-5 real-world projects. You'll build a strong portfolio by the end of your training." },
      { q: "What if I miss a class?", a: "Recorded sessions are available for all classes. You can also attend the same topic in another batch." },
      { q: "Do you have weekend batches for working professionals?", a: "Yes, we have dedicated weekend batches designed specifically for working professionals." },
      { q: "Who are the trainers?", a: "Our trainers are industry professionals with 5-15 years of experience in leading tech companies." },
      { q: "Do you provide internship certificates?", a: "Yes, upon successful completion of projects and assessments, you'll receive an internship certificate." },
      { q: "How long are the courses?", a: "Course duration varies from 2-6 months depending on the program. Intensive bootcamps are also available." },
      { q: "Do you provide study materials?", a: "Yes, comprehensive study materials, practice exercises, and reference guides are provided free of cost." },
      { q: "What is the class timing?", a: "We have flexible timings - morning (9 AM-12 PM), afternoon (2 PM-5 PM), and evening (6 PM-9 PM) batches." },
    ],
  },
  {
    title: "Placements & Career Support",
    icon: Briefcase,
    questions: [
      { q: "Do you offer placement assistance?", a: "Yes, we provide 100% placement assistance including job referrals, interview scheduling, and career counseling." },
      { q: "Which companies hire from AOTMS?", a: "Our students are placed in companies like TCS, Infosys, Wipro, Accenture, Amazon, and many startups." },
      { q: "What is the average salary package?", a: "Average package ranges from 3-8 LPA for freshers, depending on the course and individual performance." },
      { q: "How many students have been placed?", a: "We have successfully placed over 2000+ students with a placement rate of 85%+ across all batches." },
      { q: "Do you conduct mock interviews?", a: "Yes, regular mock interviews with HR and technical rounds are conducted by industry experts." },
      { q: "Will you help with resume building?", a: "Absolutely! Our career services team helps you create ATS-friendly resumes and optimize your LinkedIn profile." },
    ],
  },
  {
    title: "Certification & Fees",
    icon: Award,
    questions: [
      { q: "Will I get a certificate upon completion?", a: "Yes, you'll receive an industry-recognized course completion certificate and project certificates." },
      { q: "Do you offer installment options for fees?", a: "Yes, we offer flexible EMI options. Pay in 3-6 easy installments with no additional charges." },
      { q: "Are there any scholarships available?", a: "Merit-based scholarships up to 30% are available. Early bird discounts are also offered regularly." },
      { q: "What is included in the course fee?", a: "Course fee includes training, materials, project guidance, placement assistance, and lifetime access to resources." },
    ],
  },
  {
    title: "Tools & Technologies",
    icon: Wrench,
    questions: [
      { q: "What programming languages and tools will I learn?", a: "Depending on your course - Python, Java, JavaScript, React, SQL, Git, AWS, and many more industry-standard tools." },
      { q: "Do you provide access to premium tools and software?", a: "Yes, we provide free access to premium software, cloud platforms, and development tools during training." },
      { q: "Will I learn the latest technologies?", a: "Our curriculum is updated quarterly to include the latest technologies and industry trends." },
      { q: "Do you teach version control and collaboration tools?", a: "Yes, Git, GitHub, and agile collaboration tools are part of every technical course." },
      { q: "Will I get hands-on practice with real tools?", a: "Absolutely! Every session includes practical exercises using real development environments." },
    ],
  },
  {
    title: "Location & Facilities",
    icon: MapPin,
    questions: [
      { q: "Where is AOTMS located in Vijayawada?", a: "We are located in the heart of Vijayawada with easy access to public transportation." },
      { q: "What facilities are available at the Vijayawada campus?", a: "AC classrooms, high-speed WiFi, computer labs, library, cafeteria, and recreational areas." },
      { q: "Is parking available?", a: "Yes, free two-wheeler and four-wheeler parking is available for students." },
      { q: "Can I visit the campus before enrolling?", a: "Yes! We encourage campus visits. Book a free demo session to experience our training firsthand." },
      { q: "Do you have hostel facilities?", a: "We have tie-ups with nearby hostels and PGs. Our team can help you find accommodation." },
    ],
  },
  {
    title: "Technical Support & Doubt Clearing",
    icon: HeadphonesIcon,
    questions: [
      { q: "How can I get my doubts cleared?", a: "Dedicated doubt-clearing sessions, one-on-one mentoring, and 24/7 community support are available." },
      { q: "Is there support available after course completion?", a: "Yes, you get 6 months of post-course support for doubts, job assistance, and career guidance." },
      { q: "Can I access trainers outside class hours?", a: "Yes, trainers are available via our learning portal and WhatsApp groups for quick queries." },
      { q: "Do you have an online learning portal?", a: "Yes, our LMS portal includes video lectures, assignments, quizzes, and progress tracking." },
    ],
  },
];

const FAQSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to frame index (playing only first 60 frames for slower effect)
  const TOTAL_FRAMES = 224;
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => {
    const loadImages = async () => {
      const imageUrls = import.meta.glob('@/Home_images/*.jpg', { eager: true, query: '?url', import: 'default' });
      const sortedUrls = Object.keys(imageUrls)
        .sort((a, b) => {
          const aNum = parseInt(a.match(/frame-(\d+)/)?.[1] || "0");
          const bNum = parseInt(b.match(/frame-(\d+)/)?.[1] || "0");
          return aNum - bNum;
        })
        .map(key => imageUrls[key] as string);

      const loadedImages: HTMLImageElement[] = [];
      for (const url of sortedUrls) {
        const img = new Image();
        img.src = url;
        await new Promise((resolve) => {
          img.onload = () => resolve(null);
          img.onerror = () => resolve(null);
        });
        loadedImages.push(img);
      }
      setImages(loadedImages);
      setIsLoaded(true);
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (!isLoaded || images.length === 0) return;

    const renderFrame = (index: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const img = images[Math.round(index)];
      if (!img) return;

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    const handleResize = () => renderFrame(frameIndex.get());
    window.addEventListener("resize", handleResize);
    renderFrame(0);

    const unsubscribe = frameIndex.on("change", (latest) => renderFrame(latest));
    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoaded, frameIndex, images]);

  return (
    <section ref={containerRef} id="faq" className="section-padding bg-muted/30">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Frequently Asked <span className="text-accent">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about AOTMS training programs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Side - Sticky Visual (1080x1920 aspect ratio) */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="sticky top-24 w-full lg:aspect-[10/14] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl bg-black z-10">
              <canvas ref={canvasRef} className="w-full h-full block object-cover" />
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 font-mono tracking-widest text-sm">
                  INITIALIZING...
                </div>
              )}
            </div>
          </div>

          {/* Right Side - FAQ Content */}
          <div className="lg:col-span-7 space-y-12 lg:space-y-32 relative z-0 pb-24">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl text-foreground">
                    {category.title}
                  </h3>
                </div>

                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${categoryIndex}-${index}`}
                      className="border border-border/50 rounded-xl px-4 data-[state=open]:bg-muted/50"
                    >
                      <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline py-3">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm pb-4">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
