"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, ArrowLeft, Video, Mic, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function StudentEntryPage() {
  const router = useRouter();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"new" | "resume">("new");
  
  // New Test Form State
  const [teacherTestId, setTeacherTestId] = useState("");
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  
  // Resume Test Form State
  const [studentTestId, setStudentTestId] = useState("");
  const [resumeSecurityAnswer, setResumeSecurityAnswer] = useState("");

  // Modal State
  const [showIdModal, setShowIdModal] = useState(false);
  const [generatedStudentId, setGeneratedStudentId] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Handle Form Submission
  const handleStartNewTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherTestId || !fullName || !rollNumber || !email || !securityAnswer) {
      alert("Please fill all required fields");
      return;
    }

    // Generate a random ID
    const newId = `STU-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    setGeneratedStudentId(newId);
    setShowIdModal(true);
  };

  const handleResumeTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentTestId || !resumeSecurityAnswer) {
      alert("Please fill all fields");
      return;
    }
    // Proceed to permission modal
    setShowPermissionModal(true);
  };

  const proceedFromIdModal = () => {
    setShowIdModal(false);
    setShowPermissionModal(true);
  };

  const grantPermissionsAndStart = () => {
    // Extract ID if it's a URL
    let finalTestId = teacherTestId;
    try {
      if (teacherTestId.startsWith("http")) {
        const url = new URL(teacherTestId);
        finalTestId = url.searchParams.get("testId") || teacherTestId;
      }
    } catch(e) {}

    // Simulate permission granting
    setTimeout(() => {
      router.push(`/exam?studentName=${encodeURIComponent(fullName || 'Student')}&testId=${encodeURIComponent(finalTestId)}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-6 left-6 p-2 hover:bg-slate-200 rounded-full transition-colors bg-white shadow-sm border border-slate-200">
        <ArrowLeft className="w-5 h-5 text-slate-600" />
      </Link>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-primary-600 p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Student Portal</h1>
          <p className="text-primary-100 text-sm">Access your secure examination</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("new")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === "new" ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
          >
            Start New Test
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === "resume" ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
          >
            Resume Test
          </button>
        </div>

        {/* Forms */}
        <div className="p-8">
          {activeTab === "new" ? (
            <form onSubmit={handleStartNewTest} className="space-y-4">
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-2 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <p className="text-sm text-primary-900">
                  Enter the Test ID or Link provided by your teacher to join the correct exam.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teacher Test ID / Link *</label>
                <input required type="text" value={teacherTestId} onChange={e => setTeacherTestId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. test-123456" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number *</label>
                  <input required type="text" value={rollNumber} onChange={e => setRollNumber(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="CS-2024-01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="+1..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="john@university.edu" />
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                <label className="block text-sm font-semibold text-slate-800 mb-1">Security Question *</label>
                <p className="text-xs text-slate-500 mb-3">Used for resuming your test if disconnected.</p>
                <div className="text-sm text-slate-700 mb-2 font-medium">What is your favorite color?</div>
                <input required type="password" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Your answer" />
              </div>
              
              <button type="submit" className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-primary-500/30">
                Register & Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleResumeTest} className="space-y-5">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-2 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-900">
                  Enter the Student Test ID you received when you first started the test, along with your security answer.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student Test ID *</label>
                <input required type="text" value={studentTestId} onChange={e => setStudentTestId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono tracking-wider" placeholder="STU-000000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Security Answer *</label>
                <input required type="password" value={resumeSecurityAnswer} onChange={e => setResumeSecurityAnswer(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Your answer" />
              </div>
              
              <button type="submit" className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors shadow-lg">
                Verify & Resume Exam
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ID Generation Modal */}
      {showIdModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Complete</h2>
            <p className="text-slate-600 mb-6">
              Please save this Student Test ID. You will need it to resume the exam if disconnected.
            </p>
            
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 mb-8">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Student Test ID</span>
              <span className="text-2xl font-mono font-bold text-slate-900 tracking-widest">{generatedStudentId}</span>
            </div>
            
            <button 
              onClick={proceedFromIdModal}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              I have saved it, Continue
            </button>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">System Check</h2>
            <p className="text-slate-600 mb-8 text-center text-sm">
              Camera and Microphone access is strictly required to start the proctored test.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Camera Access</h3>
                  <p className="text-xs text-slate-500">Used for face tracking and identity verification.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Microphone Access</h3>
                  <p className="text-xs text-slate-500">Used to detect ambient noise and voices.</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPermissionModal(false)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={grantPermissionsAndStart}
                className="flex-[2] bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2 shadow-lg shadow-green-600/20"
              >
                Allow Access & Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
