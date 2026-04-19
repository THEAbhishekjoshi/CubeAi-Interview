import CameraViewLeftPannel from "@/components/CameraViewLeftPannel"
import CheckYourTech from "@/components/CheckYourTech"
import { useEffect } from "react"
import type{ Status } from "@/hooks/useMediaStream"

interface WaitingRoomPageProps {
  onStartInterview?: () => void;
  stream: MediaStream | null;
  videoStatus: Status;
  audioStatus: Status;
  startMedia: () => void;
}

const WaitingRoomPage = ({ onStartInterview, stream, videoStatus, audioStatus, startMedia }: WaitingRoomPageProps) => {
 

  useEffect(() => {
    startMedia()
  }, [])

  return (
    <div className='p-8 h-full w-full'>
      <div className='h-full w-full grid grid-flow-row grid-cols-1 grid-rows-2 md:grid-flow-col md:grid-cols-2 md:grid-rows-1 gap-3 md:gap-5'>
        <div className=' '>
          <CameraViewLeftPannel videoStatus={videoStatus} stream={stream} />
        </div>
        <div className=''>
          <CheckYourTech 
            videoStatus={videoStatus}  
            audioStatus={audioStatus} 
            startMedia={startMedia}
            onStartInterview={onStartInterview}
          />
        </div>
      </div>
    </div>
  )
}

export default WaitingRoomPage