"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, User, Award, ArrowRight } from "lucide-react";

function ResultContent() {
  const searchParams = useSearchParams();
  
  const studentName = searchParams.get("studentName") || "Student";
  const score = parseInt(searchParams.get("score") || "0");
  const total = parseInt(searchParams.get("total") || "0");
  const warnings = parseInt(searchParams.get("warnings") || "0");
  const status = searchParams.get("status") || "completed"; // "completed" | "terminated"

  const isTerminated = status === "terminated";
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  
  const isPass = percentage >= 50 && !isTerminated;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header Status */}
        <div className={`p-8 text-center text-white ${isTerminated ? 'bg-red-600' : isPass ? 'bg-green-600' : 'bg-slate-800'}`}>
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            {isTerminated ? (
              <XCircle className="w-10 h-10 text-white" />
            ) : isPass ? (
              <CheckCircle2 className="w-10 h-10 text-white" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isTerminated ? "Exam Terminated" : "Exam Completed"}
          </h1>
          <p className="text-white/80 font-medium">
            {isTerminated 
              ? "Your exam was terminated due to policy violations." 
              : "Your responses have been successfully recorded."}
          </p>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Left Col: Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" /> Candidate
                </h3>
                <p className="text-xl font-bold text-slate-900">{studentName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Violations
                </h3>
                <p className={`text-xl font-bold ${warnings > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {warnings} recorded
                </p>
              </div>
            </div>

            {/* Right Col: Score */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Award className="w-4 h-4" /> Final Score
              </h3>
              {isTerminated ? (
                <span className="text-3xl font-bold text-slate-400">N/A</span>
              ) : (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-extrabold ${isPass ? 'text-green-600' : 'text-slate-900'}`}>
                      {score}
                    </span>
                    <span className="text-xl font-semibold text-slate-400">/{total}</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-500">
                    {percentage}% Accuracy
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center border-t border-slate-100 pt-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg"
            >
              Return to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading results...</div>}>
      <ResultContent />
    </Suspense>
  );
}
