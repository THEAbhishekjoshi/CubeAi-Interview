import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  MessageSquare, 
  ArrowLeft, 
  Mail, 
  Calendar, 
  ThumbsUp, 
  TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface Question {
  id: string;
  questionText: string;
  answerText: string | null;
}

interface ReportData {
  id: string;
  overallScore: number | null;
  feedback: string | null;
  recommendation: string | null; // "PASS" or "FAIL"
  strengths: string[];
  improvements: string[];
  rubricScores: {
    clarity: number;
    warmth: number;
    accuracy: number;
  } | null;
  candidate: {
    name: string;
    email: string;
  };
  questions: Question[];
  createdAt: string;
}

const InterviewReportPage = () => {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // For animating the SVG circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/interview/report/${interviewId}`
            )
        const result = response.data

        if (result.success) {
          setData(result.data)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError("Failed to connect to server.")
      } finally {
        setLoading(false)
      }
    };

    fetchReport()
  }, [interviewId])

  useEffect(() => {
    if (data && !loading) {
      const score = data.overallScore || 0;
      setTimeout(() => {
        setOffset(circumference - (score / 5) * circumference);
      }, 100);
    }
  }, [data, loading, circumference]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl max-w-md text-center border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <XCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">{error || "This report is not available or has been deleted."}</p>
          <Button onClick={() => navigate('/addcandidate')} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const rubric = data.rubricScores || { clarity: 0, warmth: 0, accuracy: 0 };
  const score = data.overallScore || 0;
  const isPassed = data.recommendation === "PASS";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden montserrat-font">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] ${isPassed ? 'bg-emerald-400/10 dark:bg-emerald-600/10' : 'bg-red-400/10 dark:bg-red-600/10'} rounded-full blur-3xl pointer-events-none`}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation */}
        <button onClick={() => navigate('/addcandidate')} className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 transition-all">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner ${isPassed ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'}`}>
              {data.candidate.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{data.candidate.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"><Mail className="w-3.5 h-3.5" /> {data.candidate.email}</span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"><Calendar className="w-3.5 h-3.5" /> {new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className={`px-6 py-3.5 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-sm ${isPassed ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50'}`}>
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </span>
            {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {isPassed ? "RECOMMENDED FOR HIRE" : "NOT RECOMMENDED"}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Score Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Soft glow behind the circle */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-3xl opacity-30 ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 relative z-10">Overall Score</h3>
            
            <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 120 120">
                {/* Background track */}
                <circle 
                  cx="60" cy="60" r={radius} fill="none" 
                  className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" 
                />
                {/* Animated progress */}
                <circle 
                  cx="60" cy="60" r={radius} fill="none" 
                  className={isPassed ? "stroke-emerald-500" : "stroke-red-500"} 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-5xl font-black ${isPassed ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  {score.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">out of 5.0</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium relative z-10">Candidate evaluated by Cuemath AI Agent</p>
          </div>

          {/* AI Feedback & Rubrics */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-lg">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> AI Summary Feedback
            </h3>
            <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-700/50">
              <p className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed italic">
                "{data.feedback || "No feedback generated."}"
              </p>
            </div>

            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Rubric Breakdown
            </h3>
            <div className="space-y-6">
              {Object.entries(rubric).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm font-bold mb-2 capitalize">
                    <span className="text-slate-700 dark:text-slate-200">{key}</span>
                    <span className="text-slate-500 dark:text-slate-400">{value} <span className="text-xs font-medium">/ 5</span></span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        value >= 4 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 
                        value >= 3 ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 
                        'bg-gradient-to-r from-red-500 to-rose-400'
                      }`}
                      style={{ width: `${(value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Improvements Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-emerald-50/80 dark:bg-emerald-900/10 backdrop-blur-xl rounded-[2rem] p-8 border border-emerald-100 dark:border-emerald-800/30 shadow-lg">
                <h4 className="text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-6 flex items-center gap-2 tracking-wide uppercase">
                    <ThumbsUp className="w-4 h-4" /> Top Pedagogical Strengths
                </h4>
                <ul className="space-y-4">
                    {data.strengths?.length > 0 ? data.strengths.map((s, i) => (
                        <li key={i} className="text-[15px] text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="leading-relaxed">{s}</span>
                        </li>
                    )) : <li className="text-sm text-emerald-600/60 dark:text-emerald-400/60 italic">No specific strengths noted.</li>}
                </ul>
            </div>

            <div className="bg-orange-50/80 dark:bg-orange-900/10 backdrop-blur-xl rounded-[2rem] p-8 border border-orange-100 dark:border-orange-800/30 shadow-lg">
                <h4 className="text-orange-700 dark:text-orange-400 font-bold text-sm mb-6 flex items-center gap-2 tracking-wide uppercase">
                    <TrendingUp className="w-4 h-4" /> Areas to Improve
                </h4>
                <ul className="space-y-4">
                    {data.improvements?.length > 0 ? data.improvements.map((imp, i) => (
                        <li key={i} className="text-[15px] text-orange-800 dark:text-orange-300 flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500 dark:bg-orange-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                            <span className="leading-relaxed">{imp}</span>
                        </li>
                    )) : <li className="text-sm text-orange-600/60 dark:text-orange-400/60 italic">No specific improvements noted.</li>}
                </ul>
            </div>
        </div>

        {/* Transcript Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 lg:p-10 border border-slate-200/60 dark:border-slate-800/60 shadow-lg mb-10">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">Interview Transcript</h3>
          <div className="space-y-8">
            {data.questions.map((q, index) => (
              <div key={q.id} className="border-b border-slate-100 dark:border-slate-800 pb-8 last:border-b-0 last:pb-0">
                <div className="flex gap-4 md:gap-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 shadow-sm">
                    Q{index + 1}
                  </div>
                  <div className="flex-1 mt-1">
                    <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 mb-4 leading-relaxed">{q.questionText}</p>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-[15px] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/50 shadow-inner">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500"></span>
                        <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Candidate Answer</span>
                      </div>
                      <p className="leading-relaxed">
                        {q.answerText || <span className="italic text-slate-400 dark:text-slate-500">No answer recorded or processed.</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default InterviewReportPage