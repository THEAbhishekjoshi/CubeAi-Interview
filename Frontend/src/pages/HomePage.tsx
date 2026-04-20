import { ArrowRight, Bot, Sparkles, Mic, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden montserrat-font">
      {/* Background glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/20 dark:bg-emerald-600/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center space-y-12">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cuemath AI Builder Challenge</span>
        </div>

        {/* Hero Content */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Cube</span>
            <br />
            Your AI Interviewer.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Scale your tutor hiring process without losing quality. Real-time voice interviews, dynamic math questions, and automated grading reports.
          </p>
        </div>

        {/* CTA Button */}
        <div>
          <Link to="/addcandidate">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-6xl mx-auto w-full pb-20">
          
          <div className="group flex flex-col items-center text-center space-y-4 p-8 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 w-20 h-20 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Bot className="w-10 h-10" />
            </div>
            <h3 className="relative z-10 font-bold text-xl text-slate-900 dark:text-white mt-4">Dynamic AI Questions</h3>
            <p className="relative z-10 text-slate-500 dark:text-slate-400 leading-relaxed">
              Questions adapt dynamically to the candidate's answers in real-time, powered by GPT-4o.
            </p>
          </div>

          <div className="group flex flex-col items-center text-center space-y-4 p-8 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 to-transparent dark:from-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 w-20 h-20 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Mic className="w-10 h-10" />
            </div>
            <h3 className="relative z-10 font-bold text-xl text-slate-900 dark:text-white mt-4">Voice Interaction</h3>
            <p className="relative z-10 text-slate-500 dark:text-slate-400 leading-relaxed">
              Seamless low-latency audio streaming and precise speech-to-text using OpenAI Whisper.
            </p>
          </div>

          <div className="group flex flex-col items-center text-center space-y-4 p-8 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-50/80 to-transparent dark:from-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 w-20 h-20 bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="relative z-10 font-bold text-xl text-slate-900 dark:text-white mt-4">Automated Reports</h3>
            <p className="relative z-10 text-slate-500 dark:text-slate-400 leading-relaxed">
              Get an instant scorecard evaluating Clarity, Warmth, and Mathematical Accuracy.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
