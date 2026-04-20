import { useEffect, useState } from "react"
import WaitingRoomPage from "./WaitingRoomPage"
import InterviewPanel from "@/components/InterviewPanel"

import { useMediaStream } from "@/hooks/useMediaStream"
import axios from "axios"


const InterviewRoom = () => {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [candidateName, setCandidateName] = useState("Candidate")
  const { stream, videoStatus, audioStatus, startMedia } = useMediaStream()

  // Get interviewId from URL
  const interviewId = window.location.pathname.split('/')[2]

  useEffect(() => {
    startMedia()

    // Fetch interview details
    const fetchInterviewDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/interview/${interviewId}`)
        if (response.status === 200) {
          setCandidateName(response.data.candidateName)
          console.log("Candidate Name:", response.data.candidateName)
        }
        console.log("Candidate Name:", response)
      } catch (error) {
        console.error("Error fetching interview details:", error)
      }
    }

    if (interviewId) {
      fetchInterviewDetails()
    }
  }, [startMedia, interviewId])

  const handleStartInterview = () => {
    setIsInterviewStarted(true)
  }

  return (
    <div className="w-full h-screen bg-white">
      {!isInterviewStarted ? (
        <WaitingRoomPage
          onStartInterview={handleStartInterview}
          stream={stream}
          videoStatus={videoStatus}
          audioStatus={audioStatus}
          startMedia={startMedia}
        />
      ) : (
        <InterviewPanel
          stream={stream}
          videoStatus={videoStatus}
          audioStatus={audioStatus}
          candidateName={candidateName}
        />
      )}
    </div>
  )
}

export default InterviewRoom
