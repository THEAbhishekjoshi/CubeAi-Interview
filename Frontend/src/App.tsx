import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CandidateDashboardPage from "@/pages/CandidateDashboardPage";  
import InterviewRoom from "./pages/interviewRoom";
import InterviewCompletionPage from "./pages/InterviewCompletionPage";
import InterviewReportPage from "./pages/InterviewReportPage";
import HomePage from "./pages/HomePage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/addcandidate" element={<CandidateDashboardPage />} />
        <Route path="/interview/:interviewId/:token" element={<InterviewRoom />} />
        <Route path="/interview-complete" element={<InterviewCompletionPage />} />
        <Route path="/interview-report/:interviewId" element={<InterviewReportPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
