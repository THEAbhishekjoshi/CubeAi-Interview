import { CheckCircle2, Mail, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const InterviewCompletionPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-10 text-center border border-slate-100">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Interview Submitted!</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Great job! Your responses have been successfully recorded. Our team (and our AI) will review your performance and get back to you shortly.
        </p>

        <div className="bg-blue-50 rounded-2xl p-6 mb-8 flex items-start gap-4 text-left border border-blue-100">
          <Mail className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
          <div>
            <h4 className="text-blue-900 font-semibold text-sm">Next Steps</h4>
            <p className="text-blue-700/70 text-xs mt-1">
              A detailed feedback summary will be sent to your registered email address within 24 hours.
            </p>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/addcandidate')} 
          variant="outline"
          className="w-full py-6 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all gap-2"
        >
          <Home className="w-4 h-4" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default InterviewCompletionPage