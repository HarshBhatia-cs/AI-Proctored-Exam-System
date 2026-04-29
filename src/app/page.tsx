import Link from "next/link";
import { ShieldCheck, GraduationCap, UserCog, ArrowRight, Activity, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/40 blur-3xl mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-3xl mix-blend-multiply" />

      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between z-10 border-b border-slate-200/50 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">ProctorAI</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <span className="hover:text-primary-600 cursor-pointer transition-colors">Features</span>
          <span className="hover:text-primary-600 cursor-pointer transition-colors">Security</span>
          <span className="hover:text-primary-600 cursor-pointer transition-colors">About</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="max-w-4xl w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-6 border border-primary-100 shadow-sm">
            <Activity className="w-4 h-4" />
            <span>Next-Generation Online Testing</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            AI Proctored <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
              Exam System
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
            A secure, reliable, and advanced online examination platform. 
            Ensure academic integrity with real-time AI monitoring and seamless user experience.
          </p>

          <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
            {/* Teacher Card */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-primary-200 transition-all duration-300 text-left flex flex-col">
              <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserCog className="w-7 h-7 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">For Teachers</h2>
              <p className="text-slate-600 mb-8 flex-1">
                Create custom exams, manage questions, and generate secure test links for your students in seconds.
              </p>
              <Link 
                href="/teacher"
                className="inline-flex items-center justify-between w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-medium transition-colors"
              >
                <span>Create Test</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Student Card */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 text-left flex flex-col">
              <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-7 h-7 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">For Students</h2>
              <p className="text-slate-600 mb-8 flex-1">
                Join an active examination securely. Requires camera and microphone access for AI proctoring.
              </p>
              <Link 
                href="/student"
                className="inline-flex items-center justify-between w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30"
              >
                <span>Start Test</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="mt-16 flex items-center gap-2 text-slate-500 text-sm">
            <Lock className="w-4 h-4" />
            <span>End-to-end encrypted • Automated anomaly detection</span>
          </div>
        </div>
      </main>
    </div>
  );
}
