"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Clock, ChevronLeft, ChevronRight, Maximize, AlertCircle } from "lucide-react";

// Fallback Exam Data in case testId is not found
const MOCK_EXAM = {
  id: "fallback",
  title: "Midterm: Introduction to Computer Science",
  duration: 60,
  questions: [
    {
      id: "q1",
      text: "What is the primary function of a CPU?",
      options: [
        "To store data permanently",
        "To execute instructions and process data",
        "To display images on the screen",
        "To connect to the internet"
      ],
      correctAnswer: 1
    },
    {
      id: "q2",
      text: "Which of the following is NOT a fundamental data type in JavaScript?",
      options: ["String", "Boolean", "Float", "Undefined"],
      correctAnswer: 2
    },
    {
      id: "q3",
      text: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyperlink and Text Markup Language",
        "Home Tool Markup Language"
      ],
      correctAnswer: 0
    }
  ]
};

function ExamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentName = searchParams.get("studentName") || "Student";
  const testId = searchParams.get("testId");

  const [examData, setExamData] = useState<any>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(MOCK_EXAM.duration * 60);
  
  // Anti-Cheating State
  const [warnings, setWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const warningsRef = useRef(0);
  const isModalOpenRef = useRef(false);
  const examEndedRef = useRef(false);
  const answersRef = useRef(answers);

  useEffect(() => { warningsRef.current = warnings; }, [warnings]);
  useEffect(() => { isModalOpenRef.current = showWarningModal; }, [showWarningModal]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  // Video Ref for Camera
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load Exam Data
  useEffect(() => {
    if (testId) {
      const saved = localStorage.getItem("MOCK_TESTS_DB");
      if (saved) {
        const tests = JSON.parse(saved);
        const found = tests.find((t: any) => t.id === testId);
        if (found && found.questions && found.questions.length > 0) {
          setExamData(found);
          setTimeLeft(found.duration * 60);
          return;
        }
      }
    }
    // Fallback
    setExamData(MOCK_EXAM);
  }, [testId]);

  // Request Media Devices
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera/Mic access denied or unavailable", err);
      }
    };
    
    startMedia();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Timer Effect
  useEffect(() => {
    if (!examData) return;
    
    if (timeLeft <= 0) {
      handleAutoSubmit("completed");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, examData]);

  // Format Time
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleViolation = () => {
    if (examEndedRef.current) return;
    if (isModalOpenRef.current) return;

    const newWarnings = warningsRef.current + 1;
    setWarnings(newWarnings);
    warningsRef.current = newWarnings;

    if (newWarnings >= 2) {
      handleAutoSubmit("terminated");
    } else {
      setShowWarningModal(true);
    }
  };

  // Real-time tab/window switch detection
  useEffect(() => {
    if (!examData) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    const handleBlur = () => {
      handleViolation();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [examData]);

  const handleAutoSubmit = (status: "completed" | "terminated") => {
    if (!examData || examEndedRef.current) return;
    examEndedRef.current = true;
    let score = 0;
    examData.questions.forEach((q: any) => {
      if (answersRef.current[q.id] === q.correctAnswer) score++;
    });

    // Save result to localStorage
    const result = {
      id: `res-${Date.now()}`,
      testId: examData.id,
      studentName: studentName,
      score: score,
      total: examData.questions.length,
      warnings: warnings,
      status: status,
      date: new Date().toISOString()
    };

    const savedResults = localStorage.getItem("MOCK_RESULTS_DB");
    const resultsArray = savedResults ? JSON.parse(savedResults) : [];
    resultsArray.push(result);
    localStorage.setItem("MOCK_RESULTS_DB", JSON.stringify(resultsArray));

    // Increment test attempt count
    const savedTests = localStorage.getItem("MOCK_TESTS_DB");
    if (savedTests) {
      const testsArray = JSON.parse(savedTests);
      const testIndex = testsArray.findIndex((t: any) => t.id === examData.id);
      if (testIndex !== -1) {
        testsArray[testIndex].attempts = (testsArray[testIndex].attempts || 0) + 1;
        localStorage.setItem("MOCK_TESTS_DB", JSON.stringify(testsArray));
      }
    }

    router.push(`/result?studentName=${encodeURIComponent(studentName)}&score=${score}&total=${examData.questions.length}&warnings=${warnings}&status=${status}`);
  };

  const handleManualSubmit = () => {
    if (window.confirm("Are you sure you want to submit the exam? You cannot undo this action.")) {
      handleAutoSubmit("completed");
    }
  };

  if (!examData) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading exam data...</div>;
  }

  const currentQuestion = examData.questions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      {/* Warning Banner */}
      <div className="bg-red-600 text-white text-sm font-semibold py-2 px-4 flex justify-center items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        <span>Do not switch tabs or exit fullscreen. Doing so will result in test termination.</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-bold text-slate-800">{examData.title}</h1>
            <p className="text-xs text-slate-500">Candidate: {studentName}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`} />
            <span className={`font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-600' : 'text-slate-800'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <button 
            onClick={handleManualSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 flex gap-6">
        {/* Left: Question Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-140px)]">
          <div className="p-8 border-b border-slate-100 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Question {currentQuestionIdx + 1} of {examData.questions.length}
              </span>
              <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                1 Marks
              </span>
            </div>

            <h2 className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">
              {currentQuestion?.text}
            </h2>

            <div className="space-y-4">
              {currentQuestion?.options.map((option: string, idx: number) => {
                const isSelected = answers[currentQuestion.id] === idx;
                return (
                  <label 
                    key={idx} 
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-slate-200 hover:border-primary-200 hover:bg-slate-50'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                    <input 
                      type="radio" 
                      name={`q-${currentQuestion.id}`} 
                      className="hidden"
                      checked={isSelected}
                      onChange={() => setAnswers({ ...answers, [currentQuestion.id]: idx })}
                    />
                    <span className={`text-base ${isSelected ? 'text-primary-900 font-medium' : 'text-slate-700'}`}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-between items-center">
            <button 
              onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
              disabled={currentQuestionIdx === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button 
              onClick={() => setCurrentQuestionIdx(Math.min(examData.questions.length - 1, currentQuestionIdx + 1))}
              disabled={currentQuestionIdx === examData.questions.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Question Palette & Camera */}
        <div className="w-72 flex flex-col gap-6">
          {/* Live Camera Feed */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm aspect-video relative flex items-center justify-center border-4 border-slate-800">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-md">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-white font-medium uppercase tracking-wider">Live</span>
            </div>
            {!videoRef.current?.srcObject && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
                <Maximize className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-semibold">Camera Access Required</span>
              </div>
            )}
          </div>

          {/* Question Palette */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex-1 overflow-y-auto max-h-[calc(100vh-340px)]">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Question Palette</h3>
            <div className="grid grid-cols-4 gap-2">
              {examData.questions.map((q: any, idx: number) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentQuestionIdx === idx;
                
                let btnClass = "w-10 h-10 rounded-lg text-sm font-semibold flex items-center justify-center transition-all ";
                
                if (isCurrent) {
                  btnClass += "border-2 border-primary-600 bg-primary-50 text-primary-700";
                } else if (isAnswered) {
                  btnClass += "bg-green-100 text-green-700 border border-green-200";
                } else {
                  btnClass += "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200";
                }

                return (
                  <button 
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={btnClass}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
                <span className="text-slate-600">Answered</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200" />
                <span className="text-slate-600">Not Answered</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded border-2 border-primary-600 bg-primary-50" />
                <span className="text-slate-600">Current</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Warning Recorded</h2>
            <p className="text-slate-600 mb-6">
              A tab switch or window exit was detected. This is a violation of exam rules.
              <br /><br />
              <span className="font-bold text-red-600 block bg-red-50 p-2 rounded-lg border border-red-100">
                Warning {warnings} of 2
              </span>
              <br />
              Further violations will result in automatic termination of your exam.
            </p>
            
            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors shadow-lg"
            >
              I Understand, Return to Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading exam environment...</div>}>
      <ExamContent />
    </Suspense>
  );
}
