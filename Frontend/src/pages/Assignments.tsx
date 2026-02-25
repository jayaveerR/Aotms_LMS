import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  UploadCloud,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Assignments = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "pending" | "submitted"
  >("pending");

  const handleFileUpload = (
    e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        toast.success("DATA_TRANSFER_COMPLETE");
      }
    }, 300);
  };

  const handleSubmit = () => {
    setSubmissionStatus("submitted");
    toast.success("MISSION_SUBMITTED");
  };

  return (
    <div className="min-h-screen bg-white font-['Inter'] flex flex-col">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Header */}
        <section className="bg-[#E9E9E9] border-b-8 border-black pt-32 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

          <div className="container-width px-4 lg:px-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border-2 border-black shadow-[4px_4px_0px_0px_#FD5A1A] text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
                <Star className="w-4 h-4 text-[#FD5A1A]" /> ACTIVE_MISSION
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#0075CF] mb-4">
                    <span>ADVANCED REACT</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                    <span>MODULE_04: STATE_MANAGEMENT</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-black leading-[0.9] uppercase italic mb-6">
                    BUILDING A REAL-WORLD <br />
                    <span className="text-[#FD5A1A]">DASHBOARD</span>
                  </h1>
                  <p className="text-black font-bold uppercase tracking-widest text-sm opacity-60">
                    INSTRUCTOR:{" "}
                    <span className="text-black">SARAH JOHNSON</span>
                  </p>
                </div>

                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#FD5A1A] text-right min-w-[240px]">
                  <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-40">
                    TERMINATION_DATE
                  </span>
                  <div className="text-2xl font-black text-[#FD5A1A] flex items-center gap-3 justify-end italic">
                    <Clock className="w-6 h-6" /> IN_2_DAYS
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container-width px-4 lg:px-16 py-16 grid lg:grid-cols-3 gap-12 relative z-10">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

          {/* Left Column - Details & Content */}
          <div className="lg:col-span-2 space-y-12 relative z-10">
            {/* 2. Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <h2 className="text-2xl font-black text-black uppercase italic mb-6 border-b-4 border-black pb-4 inline-block">
                MISSION_PARAMETERS
              </h2>
              <div
                className={`text-black font-bold text-sm uppercase tracking-wider leading-relaxed opacity-70 ${!isExpanded ? "line-clamp-3" : ""}`}
              >
                <p className="mb-4">
                  In this assignment, you will apply your knowledge of React
                  Context API and Redux Toolkit to build a functional analytics
                  dashboard. This task mirrors real-world requirements for
                  frontend developers in 2024.
                </p>
                <h4 className="text-black opacity-100 font-black mb-2">
                  OBJECTIVES:
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IMPLEMENT GLOBAL STATE MANAGEMENT EFFECTIVELY.</li>
                  <li>OPTIMIZE RENDERING PERFORMANCE USING MEMOIZATION.</li>
                  <li>HANDLE ASYNCHRONOUS DATA FETCHING WITH REDUX THUNKS.</li>
                </ul>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-6 text-black hover:bg-black hover:text-white border-2 border-black rounded-none font-black uppercase tracking-widest text-xs h-10 px-6"
              >
                {isExpanded ? "COLLAPSE_LOGS" : "EXPAND_FULL_SPECS"}
              </Button>
            </motion.div>

            {/* 3. Key Details Grid */}
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  label: "MAX_MARKS",
                  value: "100_PTS",
                  icon: AlertCircle,
                  color: "#0075CF",
                },
                {
                  label: "FORMAT",
                  value: "ZIP_/_PDF",
                  icon: FileText,
                  color: "#FD5A1A",
                },
                {
                  label: "SIZE_LIMIT",
                  value: "MAX_50MB",
                  icon: UploadCloud,
                  color: "#000000",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, x: -4 }}
                  className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="w-10 h-10 bg-[#E9E9E9] border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_black]">
                    <item.icon className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] mb-1 block">
                    {item.label}
                  </span>
                  <p className="font-black text-xl text-black italic uppercase">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* 5. Submission Area */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#FD5A1A]" />
              <div className="mb-8">
                <h2 className="text-2xl font-black text-black uppercase italic mb-2">
                  DEPLOY_WORK
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                  UPLOAD ASSETS OR PROVIDE EXTERNAL LINKS.
                </p>
              </div>

              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#E9E9E9] p-1 border-2 border-black rounded-none h-14">
                  <TabsTrigger
                    value="upload"
                    className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase tracking-widest text-xs"
                  >
                    HARD_DRIVE
                  </TabsTrigger>
                  <TabsTrigger
                    value="link"
                    className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase tracking-widest text-xs"
                  >
                    NETWORK_LINK
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <div
                    className={`border-4 border-dashed p-12 text-center transition-all ${isUploading ? "border-[#0075CF] bg-[#0075CF]/5" : "border-black/20 hover:border-[#FD5A1A] hover:bg-black/5"}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileUpload}
                  >
                    <div className="w-20 h-20 bg-black text-white border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_#FD5A1A]">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    <h3 className="font-black text-xl mb-2 uppercase italic">
                      DRAG_&_DROP_PROTOCOL
                    </h3>
                    <p className="text-[10px] font-black text-black/40 uppercase mb-6">
                      OR CLICK TO SELECT FROM LOCAL STORAGE
                    </p>
                    <Button
                      className="bg-black text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_#FD5A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase tracking-widest text-xs h-12 px-8"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      SELECT_FILES
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>

                  {(isUploading || uploadProgress > 0) && (
                    <div className="mt-8 space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>UPLOADING: PROJECT-DASHBOARD.ZIP</span>
                        <span className="text-[#0075CF]">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="h-4 bg-[#E9E9E9] border-2 border-black overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-[#0075CF]"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="link">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest">
                        REMOTE_REPOSITORY_URL
                      </Label>
                      <Textarea
                        placeholder="HTTPS://GITHUB.COM/USER/PROJECT"
                        className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:border-[#0075CF] min-h-[80px] font-bold"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest">
                        TRANSMISSION_NOTES
                      </Label>
                      <Textarea
                        placeholder="ANY ADDITIONAL INTEL FOR THE INSTRUCTOR..."
                        className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:border-[#0075CF] min-h-[120px] font-bold"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t-4 border-black/10">
                <Button
                  variant="ghost"
                  className="font-black uppercase tracking-widest text-[#000000]/40 hover:text-black"
                >
                  SAVE_LOG_DRAFT
                </Button>
                <Button
                  className={`w-full sm:w-auto px-12 h-14 bg-black text-white rounded-none border-2 border-black shadow-[8px_8px_0px_0px_#FD5A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase tracking-[0.2em] text-sm ${submissionStatus === "submitted" ? "bg-[#0075CF]" : ""}`}
                  onClick={handleSubmit}
                  disabled={submissionStatus === "submitted"}
                >
                  {submissionStatus === "submitted" ? (
                    <span className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" /> MISSION_COMPLETE
                    </span>
                  ) : (
                    <>
                      EXECUTE_SUBMISSION <ArrowRight className="ml-3 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8 relative z-10">
            {/* 4. Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#0075CF]"
            >
              <h3 className="text-xl font-black text-black uppercase italic mb-6">
                INTELLIGENCE_ASSETS
              </h3>
              <div className="space-y-4">
                {[
                  { name: "GUIDELINES.PDF", type: "PDF" },
                  { name: "STARTER_PROTOCOL", type: "ZIP" },
                  { name: "CLASS_RECON_VIDEO", type: "MP4" },
                ].map((res, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-[#E9E9E9] border-2 border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_black] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
                        <Download className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black leading-none group-hover:text-[#0075CF] transition-colors">
                          {res.name}
                        </p>
                        <span className="text-[8px] font-black opacity-30 tracking-widest">
                          {res.type}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 6. Submission Status */}
            <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#FD5A1A]">
              <h3 className="text-xl font-black uppercase italic mb-6 text-[#FD5A1A]">
                SYNC_STATUS
              </h3>
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-4 h-4 rounded-none ${submissionStatus === "submitted" ? "bg-[#0075CF] shadow-[0_0_15px_#0075CF]" : "bg-[#FD5A1A] animate-pulse shadow-[0_0_15px_#FD5A1A]"}`}
                  />
                  <span className="text-xs font-black uppercase tracking-widest">
                    {submissionStatus === "submitted"
                      ? "DATA_VERIFIED"
                      : "PENDING_UPLOAD"}
                  </span>
                </div>

                <div className="relative pl-6 border-l-2 border-[#FD5A1A]/30 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[33px] top-1 w-4 h-4 bg-[#0075CF] border-2 border-black" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0075CF]">
                      MISSION_CREATED
                    </p>
                    <span className="text-[10px] font-black opacity-40">
                      OCT 24, 10:00 AM
                    </span>
                  </div>
                  {submissionStatus === "submitted" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative"
                    >
                      <div className="absolute -left-[33px] top-1 w-4 h-4 bg-[#FD5A1A] border-2 border-black" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#FD5A1A]">
                        SIGNAL_RCVD
                      </p>
                      <span className="text-[10px] font-black opacity-40 uppercase">
                        JUST_NOW
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* 8. Rules */}
            <div className="bg-[#FD5A1A] border-4 border-black p-6 flex gap-4 text-white shadow-[8px_8px_0px_0px_black] -rotate-1 hover:rotate-0 transition-transform">
              <Zap className="w-10 h-10 flex-shrink-0 text-white fill-current" />
              <div className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                <p className="mb-2 italic text-lg">LATE_PENALTY_WARNING</p>
                <p className="opacity-80">
                  SUBMISSIONS AFTER THE DUE DATE WILL INCUR A{" "}
                  <span className="text-black bg-white px-1">10%_PENALTY</span>{" "}
                  PER 24-HOUR CYCLE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Assignments;
