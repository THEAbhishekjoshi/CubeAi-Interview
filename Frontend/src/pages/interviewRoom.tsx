import { useEffect, useState } from "react"
import WaitingRoomPage from "./WaitingRoomPage"
import InterviewPanel from "@/components/InterviewPanel"

import { useMediaStream } from "@/hooks/useMediaStream"


const InterviewRoom = () => {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const { stream, videoStatus, audioStatus, startMedia } = useMediaStream();

  useEffect(() => {
    startMedia();
  }, [startMedia]);

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
        />      
      )}
    </div>
  )
}

export default InterviewRoom
