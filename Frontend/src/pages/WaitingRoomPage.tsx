import CameraViewLeftPannel from "@/components/CameraViewLeftPannel"
import CheckYourTech from "@/components/CheckYourTech"
import { useEffect } from "react"
import { Headphones } from "lucide-react"
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
    <div className='p-8 h-full w-full flex flex-col gap-6'>
      
      {/* Headphone Recommendation Banner */}
      <div className="w-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0">
          <Headphones className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base">For the best experience, please use headphones</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mt-0.5">Wearing headphones prevents audio feedback and echo, ensuring the AI can hear you clearly during the interview.</p>
        </div>
      </div>

      <div className='flex-1 w-full grid grid-flow-row grid-cols-1 grid-rows-2 md:grid-flow-col md:grid-cols-2 md:grid-rows-1 gap-3 md:gap-5'>
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