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

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md text-center border border-slate-200">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h1>
          <p className="text-slate-500 text-sm mb-6">{error || "This report is not available."}</p>
          <Button onClick={() => navigate('/addcandidate')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
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
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button onClick={() => navigate('/addcandidate')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition mb-6 font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {data.candidate.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{data.candidate.name}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {data.candidate.email}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className={`px-5 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm ${isPassed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
            {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {isPassed ? "RECOMMENDED FOR HIRE" : "NOT RECOMMENDED"}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Score Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Overall Score</h3>
            <div className={`w-32 h-32 rounded-full border-[10px] flex flex-col items-center justify-center mb-4 ${isPassed ? 'border-emerald-500 border-t-emerald-100' : 'border-red-500 border-t-red-100'}`}>
              <span className="text-4xl font-black">{score.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-bold">out of 5.0</span>
            </div>
            <p className="text-xs text-slate-500">Candidate evaluated by Cuemath AI Agent</p>
          </div>

          {/* AI Feedback & Rubrics */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> AI Summary Feedback
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 italic border-l-4 border-slate-100 pl-4">
              "{data.feedback || "No feedback generated."}"
            </p>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Rubric Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(rubric).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs font-medium mb-1 capitalize">
                    <span>{key}</span>
                    <span className="text-slate-500">{value} / 5</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${value >= 3.5 ? 'bg-emerald-500' : 'bg-red-500'}`}
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
            <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
                <h4 className="text-emerald-700 font-bold text-sm mb-4 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" /> Top Pedagogical Strengths
                </h4>
                <ul className="space-y-3">
                    {data.strengths?.length > 0 ? data.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-emerald-800 flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                            {s}
                        </li>
                    )) : <li className="text-xs text-slate-400 italic">No specific strengths noted.</li>}
                </ul>
            </div>

            <div className="bg-orange-50/50 rounded-3xl p-6 border border-orange-100">
                <h4 className="text-orange-700 font-bold text-sm mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Areas to Improve
                </h4>
                <ul className="space-y-3">
                    {data.improvements?.length > 0 ? data.improvements.map((imp, i) => (
                        <li key={i} className="text-sm text-orange-800 flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                            {imp}
                        </li>
                    )) : <li className="text-xs text-slate-400 italic">No specific improvements noted.</li>}
                </ul>
            </div>
        </div>

        {/* Transcript Section */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Interview Transcript</h3>
          <div className="space-y-6">
            {data.questions.map((q, index) => (
              <div key={q.id} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                <div className="flex gap-4">
                  <span className="text-xs font-bold text-blue-500 mt-1 shrink-0">Q{index + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 mb-3">{q.questionText}</p>
                    <div className="bg-slate-50 rounded-2xl p-5 text-sm text-slate-600 border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">CANDIDATE ANSWER</span>
                      <p className="leading-relaxed">
                        {q.answerText || <span className="italic text-slate-400">No answer recorded or processed.</span>}
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