import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  FileText,
  FileSearch,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Building2,
  User,
} from "lucide-react";

interface ATSResponse {
  filename: string;
  ats_score: number;
  raw_text_length: number;
  insights: {
    organizations: string[];
    skills_and_keywords: string[];
    name_candidates: string[];
  };
}

export function ATSAnalyticsManager() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a valid PDF file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/ats/analyze-resume",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || "Server error occurred during processing",
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      console.error("ATS Upload Error:", err);
      if (err instanceof Error) {
        setError(
          err.message || "Failed to connect to the ATS Analytics Engine",
        );
      } else {
        setError("Failed to connect to the ATS Analytics Engine");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['Inter'] pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#000000] uppercase tracking-wider">
            ATS Analytics Engine
          </h2>
          <p className="font-bold text-[#000000]/60">
            AI-powered resume processing and instructor screening
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 rounded-3xl border-4 border-[#000000] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white h-fit">
          <CardHeader className="bg-[#E9E9E9] border-b-4 border-[#000000] rounded-t-lg p-5">
            <CardTitle className="text-lg font-black uppercase tracking-widest text-[#000000]">
              Upload Candidate
            </CardTitle>
            <CardDescription className="text-[#000000]/60 font-bold">
              Extract insights from a PDF resume
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="border-4 border-dashed border-[#000000] bg-[#E9E9E9]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#E9E9E9] transition-colors relative">
                <input
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />

                {file ? (
                  <>
                    <FileText className="h-12 w-12 text-[#FD5A1A] mb-3" />
                    <p className="font-black text-sm uppercase tracking-wider">
                      {file.name}
                    </p>
                    <p className="text-xs font-bold text-[#000000]/60 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
                    </p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-12 w-12 text-[#000000]/40 mb-3" />
                    <p className="font-black text-sm uppercase tracking-wider">
                      Select Resume PDF
                    </p>
                    <p className="text-xs font-bold text-[#000000]/60 mt-1">
                      Click or drag to upload
                    </p>
                  </>
                )}
              </div>

              {error && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full h-12 rounded-3xl bg-[#000000] text-white border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all font-black uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Process Resume"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Screen */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="rounded-3xl border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#000000]/60 mb-1">
                        ATS Match Score
                      </p>
                      <h3
                        className={`text-5xl font-black ${result.ats_score > 70 ? "text-green-500" : result.ats_score > 40 ? "text-yellow-500" : "text-red-500"}`}
                      >
                        {result.ats_score}%
                      </h3>
                    </div>
                    <div className="h-14 w-14 bg-[#000000] border-2 border-[#000000] rounded-2xl flex items-center justify-center">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#0075CF] text-white">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-1">
                        Document Details
                      </p>
                      <h3 className="text-xl font-black truncate max-w-[150px]">
                        {result.filename}
                      </h3>
                      <p className="text-xs font-bold mt-1 text-white/80">
                        {result.raw_text_length} chars extracted
                      </p>
                    </div>
                    <div className="h-14 w-14 bg-white border-2 border-[#000000] rounded-2xl flex items-center justify-center">
                      <FileText className="h-7 w-7 text-[#000000]" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-3xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                <CardHeader className="bg-[#E9E9E9] border-b-4 border-[#000000] p-5">
                  <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Extracted Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y-4 divide-[#000000]">
                    {/* Organizations */}
                    <div className="p-6">
                      <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#000000]/60 mb-4">
                        <Building2 className="h-4 w-4" /> Detected Organizations
                      </h4>
                      {result.insights.organizations &&
                      result.insights.organizations.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.insights.organizations.map(
                            (org: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-[#FD5A1A] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              >
                                {org}
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-[#000000]/40">
                          No major organizations detected.
                        </p>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="p-6">
                      <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#000000]/60 mb-4">
                        <User className="h-4 w-4" /> Matched Target Skills
                      </h4>
                      {result.insights.skills_and_keywords &&
                      result.insights.skills_and_keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.insights.skills_and_keywords.map(
                            (skill: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-[#000000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              >
                                {skill}
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-[#000000]/40">
                          No matching technical skills found.
                        </p>
                      )}
                    </div>

                    {/* Contacts */}
                    <div className="p-6 bg-[#E9E9E9]/30">
                      <h4 className="text-sm font-black uppercase tracking-widest text-[#000000]/60 mb-2">
                        Contact Highlights
                      </h4>
                      <ul className="space-y-1">
                        {result.insights.name_candidates?.map(
                          (candidate: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm font-bold flex items-center gap-2"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-[#0075CF]"></div>
                              {candidate}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-[#000000]/20 rounded-3xl min-h-[400px]">
              <FileSearch className="h-16 w-16 text-[#000000]/20 mb-4" />
              <h3 className="text-xl font-black uppercase tracking-wider text-[#000000]/40">
                Waiting Requirements
              </h3>
              <p className="text-[#000000]/40 font-bold max-w-sm mt-2">
                Upload a candidate's resume on the left to instantly parse
                technical skills, experience, and contact details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
