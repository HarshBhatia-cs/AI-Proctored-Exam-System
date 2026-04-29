"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Copy, CheckCircle, Clock, Users, ArrowLeft, LayoutDashboard, FileText } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Test {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
  attempts: number;
  createdAt: string;
}

// Mock initial data
const MOCK_TESTS: Test[] = [
  {
    id: "test-123",
    title: "Midterm: Introduction to Computer Science",
    duration: 60,
    questions: [],
    attempts: 45,
    createdAt: "2026-04-25",
  },
  {
    id: "test-456",
    title: "Quiz: Data Structures",
    duration: 30,
    questions: [],
    attempts: 120,
    createdAt: "2026-04-20",
  }
];

export default function TeacherDashboard() {
  const [tests, setTests] = useState<Test[]>(MOCK_TESTS);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTests = localStorage.getItem("MOCK_TESTS_DB");
    if (savedTests) {
      setTests(JSON.parse(savedTests));
    } else {
      localStorage.setItem("MOCK_TESTS_DB", JSON.stringify(MOCK_TESTS));
    }
  }, []);
  
  // Form State
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);
  
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), text: "", options: ["", "", "", ""], correctAnswer: 0 }
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: string, value: any, optionIndex?: number) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        if (field === "text") return { ...q, text: value };
        if (field === "correctAnswer") return { ...q, correctAnswer: value };
        if (field === "option" && typeof optionIndex === "number") {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
      }
      return q;
    }));
  };

  const handleGenerateLink = () => {
    if (!title) return alert("Please enter a test title.");
    
    const newTest: Test = {
      id: `test-${Date.now()}`,
      title,
      duration,
      questions,
      attempts: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedTests = [newTest, ...tests];
    setTests(updatedTests);
    localStorage.setItem("MOCK_TESTS_DB", JSON.stringify(updatedTests));
    
    // Simulate link generation
    const link = `${window.location.origin}/student?testId=${newTest.id}`;
    setGeneratedLink(link);
    
    // Reset form
    setTitle("");
    setDuration(60);
    setQuestions([{ id: Date.now().toString(), text: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="flex items-center gap-2 text-primary-600 font-bold text-xl">
              <LayoutDashboard className="w-6 h-6" />
              <span>Teacher Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
              T
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Create Test Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Create New Test
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Test Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  min={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Questions</h3>
                  <button 
                    onClick={addQuestion}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {questions.map((q, index) => (
                    <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative group">
                      {questions.length > 1 && (
                        <button 
                          onClick={() => removeQuestion(q.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                      
                      <div className="mb-4 pr-8">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Question {index + 1}
                        </label>
                        <input 
                          type="text"
                          value={q.text}
                          onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                          placeholder="Enter your question here..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctAnswer === optIdx}
                              onChange={() => updateQuestion(q.id, "correctAnswer", optIdx)}
                              className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => updateQuestion(q.id, "option", e.target.value, optIdx)}
                              placeholder={`Option ${optIdx + 1}`}
                              className={`flex-1 px-3 py-2 border rounded-md sm:text-sm shadow-sm transition-colors ${q.correctAnswer === optIdx ? 'border-primary-400 bg-primary-50' : 'border-slate-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleGenerateLink}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-medium transition-colors shadow-md"
                >
                  Generate Test Link
                </button>
              </div>

              {generatedLink && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Test Created Successfully!
                  </h4>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={generatedLink}
                      className="flex-1 bg-white border border-green-300 text-green-900 text-sm rounded-lg px-3 py-2 outline-none"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Created Tests */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Recent Tests
            </h2>

            <div className="space-y-4">
              {tests.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No tests created yet.
                </div>
              ) : (
                tests.map((test) => (
                  <div key={test.id} className="border border-slate-100 rounded-xl p-4 hover:border-slate-300 hover:shadow-md transition-all group bg-slate-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800 line-clamp-1 pr-4">{test.title}</h3>
                      <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full whitespace-nowrap">
                        {test.duration} min
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-4 h-4" />
                        <span>{test.attempts} attempts</span>
                      </div>
                      
                      <Link href={`/teacher/results?testId=${test.id}`} className="text-primary-600 font-medium hover:text-primary-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Results &rarr;
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}
