"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface Result {
  id: string;
  testId: string;
  studentName: string;
  score: number;
  total: number;
  warnings: number;
  status: "completed" | "terminated";
  date: string;
}

function TeacherResultsContent() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");

  const [results, setResults] = useState<Result[]>([]);
  const [testInfo, setTestInfo] = useState<any>(null);

  useEffect(() => {
    if (testId) {
      // Load Test Info
      const savedTests = localStorage.getItem("MOCK_TESTS_DB");
      if (savedTests) {
        const tests = JSON.parse(savedTests);
        const found = tests.find((t: any) => t.id === testId);
        if (found) setTestInfo(found);
      }

      // Load Results
      const savedResults = localStorage.getItem("MOCK_RESULTS_DB");
      if (savedResults) {
        const allResults = JSON.parse(savedResults);
        const filtered = allResults.filter((r: Result) => r.testId === testId);
        setResults(filtered);
      }
    }
  }, [testId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/teacher" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900">
              {testInfo ? testInfo.title : "Test Results"}
            </h1>
            <span className="text-xs text-slate-500 font-medium">Test ID: {testId}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Attempts</p>
              <p className="text-2xl font-bold text-slate-900">{results.length}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-slate-900">
                {results.filter(r => r.status === "completed").length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Terminated</p>
              <p className="text-2xl font-bold text-slate-900">
                {results.filter(r => r.status === "terminated").length}
              </p>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-800">Student Performances</h2>
          </div>
          
          {results.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No students have taken this test yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Percentage</th>
                    <th className="px-6 py-4">Violations</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((r, i) => {
                    const percentage = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                    const isTerminated = r.status === "terminated";
                    return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {r.studentName}
                        </td>
                        <td className="px-6 py-4">
                          {isTerminated ? "-" : `${r.score} / ${r.total}`}
                        </td>
                        <td className="px-6 py-4">
                          {isTerminated ? "-" : `${percentage}%`}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${r.warnings > 0 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            {r.warnings}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isTerminated ? (
                            <span className="inline-flex items-center gap-1.5 text-red-600 font-semibold text-xs uppercase tracking-wider">
                              <XCircle className="w-4 h-4" /> Terminated
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-green-600 font-semibold text-xs uppercase tracking-wider">
                              <CheckCircle2 className="w-4 h-4" /> Completed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-500 whitespace-nowrap">
                          {new Date(r.date).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default function TeacherResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading results...</div>}>
      <TeacherResultsContent />
    </Suspense>
  );
}
