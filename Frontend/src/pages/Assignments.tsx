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
        <section className="bg-[#E9E9E9] border-b-4 sm:border-b-8 border-black pt-24 sm:pt-32 pb-8 sm:pb-12 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

          <div className="container-width px-4 lg:px-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black border-2 border-black shadow-[2px_2px_0px_0px_#FD5A1A] sm:shadow-[4px_4px_0px_0px_#FD5A1A] text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#FD5A1A]" />{" "}
                ACTIVE_MISSION
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest sm:tracking-[0.3em] text-[#0075CF] mb-3 sm:mb-4">
                    <span>ADVANCED REACT</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                    <span>MODULE_04: STATE_MANAGEMENT</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-black leading-[1] sm:leading-[0.9] uppercase italic mb-4 sm:mb-6">
                    BUILDING A REAL-WORLD <br className="hidden sm:block" />
                    <span className="text-[#FD5A1A]">DASHBOARD</span>
                  </h1>
                  <p className="text-black font-bold uppercase tracking-widest text-xs sm:text-sm opacity-60">
                    INSTRUCTOR:{" "}
                    <span className="text-black inline-block mt-1 sm:mt-0">
                      SARAH JOHNSON
                    </span>
                  </p>
                </div>

                <div className="bg-white border-2 sm:border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_#FD5A1A] sm:shadow-[8px_8px_0px_0px_#FD5A1A] text-left sm:text-right w-full sm:w-auto">
                  <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-40">
                    TERMINATION_DATE
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#FD5A1A] flex items-center gap-2 sm:gap-3 sm:justify-end italic">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" /> IN_2_DAYS
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container-width px-4 lg:px-16 py-8 sm:py-16 flex flex-col lg:grid lg:grid-cols-3 gap-8 sm:gap-12 relative z-10">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

          {/* Left Column - Details & Content */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-12 relative z-10">
            {/* 2. Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 sm:border-4 border-black p-5 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <h2 className="text-xl sm:text-2xl font-black text-black uppercase italic mb-4 sm:mb-6 border-b-2 sm:border-b-4 border-black pb-2 sm:pb-4 inline-block">
                MISSION_PARAMETERS
              </h2>
              <div
                className={`text-black font-bold text-xs sm:text-sm uppercase tracking-wider leading-relaxed opacity-70 ${!isExpanded ? "line-clamp-3 sm:line-clamp-none" : ""}`}
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
                <ul className="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2">
                  <li>IMPLEMENT GLOBAL STATE MANAGEMENT EFFECTIVELY.</li>
                  <li>OPTIMIZE RENDERING PERFORMANCE USING MEMOIZATION.</li>
                  <li>HANDLE ASYNCHRONOUS DATA FETCHING WITH REDUX THUNKS.</li>
                </ul>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-6 text-black hover:bg-black hover:text-white border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] sm:text-xs h-10 px-6 w-full sm:w-auto"
              >
                {isExpanded ? "COLLAPSE_LOGS" : "EXPAND_FULL_SPECS"}
              </Button>
            </motion.div>

            {/* 3. Key Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
                  className="bg-white p-5 sm:p-6 border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col sm:block"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E9E9E9] border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_black]">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-black text-black/40 uppercase tracking-[0.2em] mb-1 block">
                      {item.label}
                    </span>
                    <p className="font-black text-xl sm:text-2xl text-black italic uppercase">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 5. Submission Area */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 sm:border-4 border-black p-5 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 sm:h-2 bg-[#FD5A1A]" />
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-black text-black uppercase italic mb-1 sm:mb-2">
                  DEPLOY_WORK
                </h2>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black/40">
                  UPLOAD ASSETS OR PROVIDE EXTERNAL LINKS.
                </p>
              </div>

              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="flex flex-col sm:grid sm:grid-cols-2 mb-6 sm:mb-8 bg-[#E9E9E9] p-1 border-2 border-black rounded-none h-auto sm:h-14 gap-1 sm:gap-0">
                  <TabsTrigger
                    value="upload"
                    className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] sm:text-xs w-full py-3 sm:py-0"
                  >
                    HARD_DRIVE
                  </TabsTrigger>
                  <TabsTrigger
                    value="link"
                    className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] sm:text-xs w-full py-3 sm:py-0"
                  >
                    NETWORK_LINK
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <div
                    className={`border-2 sm:border-4 border-dashed p-4 sm:p-12 text-center transition-all ${isUploading ? "border-[#0075CF] bg-[#0075CF]/5" : "border-black/20 hover:border-[#FD5A1A] hover:bg-black/5"}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileUpload}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black text-white border-2 border-black flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-[4px_4px_0px_0px_#FD5A1A]">
                      <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h3 className="font-black text-lg sm:text-xl mb-2 sm:mb-3 uppercase italic leading-tight">
                      DRAG & DROP
                      <br className="block sm:hidden" /> PROTOCOL
                    </h3>
                    <p className="text-[10px] sm:text-xs font-black text-black/40 uppercase mb-4 sm:mb-6 px-2">
                      OR CLICK TO SELECT FROM LOCAL STORAGE
                    </p>
                    <Button
                      className="bg-black text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_#FD5A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase tracking-widest text-[11px] sm:text-xs h-12 px-6 sm:px-8 w-full sm:w-auto mt-2"
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
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                        REMOTE_REPOSITORY_URL
                      </Label>
                      <Textarea
                        placeholder="HTTPS://GITHUB.COM/USER/PROJECT"
                        className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:border-[#0075CF] min-h-[60px] sm:min-h-[80px] font-bold text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                        TRANSMISSION_NOTES
                      </Label>
                      <Textarea
                        placeholder="ANY ADDITIONAL INTEL FOR THE INSTRUCTOR..."
                        className="rounded-none border-2 border-black focus-visible:ring-0 focus-visible:border-[#0075CF] min-h-[100px] sm:min-h-[120px] font-bold text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 sm:border-t-4 border-black/10">
                <Button
                  variant="ghost"
                  className="font-black uppercase tracking-widest text-[#000000]/40 hover:text-black w-full sm:w-auto h-12 sm:h-14 border-2 border-black sm:border-none"
                >
                  SAVE_LOG_DRAFT
                </Button>
                <Button
                  className={`w-full sm:w-auto px-6 sm:px-12 h-12 sm:h-14 bg-black text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_#FD5A1A] sm:shadow-[8px_8px_0px_0px_#FD5A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase tracking-widest sm:tracking-[0.2em] text-[10px] sm:text-sm ${submissionStatus === "submitted" ? "bg-[#0075CF]" : ""}`}
                  onClick={handleSubmit}
                  disabled={submissionStatus === "submitted"}
                >
                  {submissionStatus === "submitted" ? (
                    <span className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                      MISSION_COMPLETE
                    </span>
                  ) : (
                    <>
                      EXECUTE_SUBMISSION{" "}
                      <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 sm:space-y-8 relative z-10 w-full mb-8 lg:mb-0">
            {/* 4. Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_#0075CF] sm:shadow-[8px_8px_0px_0px_#0075CF]"
            >
              <h3 className="text-lg sm:text-xl font-black text-black uppercase italic mb-4 sm:mb-6">
                INTELLIGENCE_ASSETS
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { name: "GUIDELINES.PDF", type: "PDF" },
                  { name: "STARTER_PROTOCOL", type: "ZIP" },
                  { name: "CLASS_RECON_VIDEO", type: "MP4" },
                ].map((res, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 sm:p-4 bg-[#E9E9E9] border-2 border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_black] transition-all cursor-pointer group flex-wrap sm:flex-nowrap gap-2 sm:gap-0"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0">
                        <Download className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-[10px] sm:text-xs font-black leading-none group-hover:text-[#0075CF] transition-colors truncate">
                          {res.name}
                        </p>
                        <span className="text-[9px] sm:text-[10px] font-black opacity-40 tracking-widest mt-1 block">
                          {res.type}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-black opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-auto sm:ml-0" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 6. Submission Status */}
            <div className="bg-black text-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_#FD5A1A] sm:shadow-[8px_8px_0px_0px_#FD5A1A]">
              <h3 className="text-lg sm:text-xl font-black uppercase italic mb-4 sm:mb-6 text-[#FD5A1A]">
                SYNC_STATUS
              </h3>
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-none ${submissionStatus === "submitted" ? "bg-[#0075CF] shadow-[0_0_10px_#0075CF]" : "bg-[#FD5A1A] animate-pulse shadow-[0_0_10px_#FD5A1A]"}`}
                  />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                    {submissionStatus === "submitted"
                      ? "DATA_VERIFIED"
                      : "PENDING_UPLOAD"}
                  </span>
                </div>

                <div className="relative pl-5 sm:pl-6 border-l-2 border-[#FD5A1A]/30 space-y-6 sm:space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[27px] sm:-left-[33px] top-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#0075CF] border-2 border-black" />
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#0075CF]">
                      MISSION_CREATED
                    </p>
                    <span className="text-[9px] sm:text-[10px] font-black opacity-40">
                      OCT 24, 10:00 AM
                    </span>
                  </div>
                  {submissionStatus === "submitted" && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative"
                    >
                      <div className="absolute -left-[27px] sm:-left-[33px] top-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#FD5A1A] border-2 border-black" />
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#FD5A1A]">
                        SIGNAL_RCVD
                      </p>
                      <span className="text-[9px] sm:text-[10px] font-black opacity-40 uppercase">
                        JUST_NOW
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* 8. Rules */}
            <div className="bg-[#FD5A1A] border-2 sm:border-4 border-black p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-white shadow-[4px_4px_0px_0px_black] sm:shadow-[8px_8px_0px_0px_black] sm:-rotate-1 sm:hover:rotate-0 transition-transform">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 text-white fill-current" />
              <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-relaxed">
                <p className="mb-1 sm:mb-2 italic text-base sm:text-lg">
                  LATE_PENALTY_WARNING
                </p>
                <p className="opacity-90 sm:opacity-80">
                  SUBMISSIONS AFTER THE DUE DATE WILL INCUR A{" "}
                  <span className="text-black bg-white px-1 mt-1 inline-block sm:mt-0">
                    10%_PENALTY
                  </span>{" "}
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
