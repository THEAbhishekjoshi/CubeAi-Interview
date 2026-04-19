import { Mic, Camera, Wifi, CheckCircle2, Play } from 'lucide-react'
import { checkInternet } from '@/utils/checkInternet'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Status } from '@/hooks/useMediaStream';

interface CheckYourTechProps {
  videoStatus: Status;
  audioStatus: Status;
  startMedia: () => void;
  onStartInterview?: () => void;
}

function CheckYourTech({ videoStatus,audioStatus ,startMedia, onStartInterview }: CheckYourTechProps) {
  const [networkStatus, setNetworkStatus] = useState<'loading' | 'Excellent' | 'Good' | 'Poor' | 'not-started'>('not-started')

  let allChecksPassed:boolean= videoStatus === 'success' && audioStatus === 'success' && (networkStatus === 'Excellent' || networkStatus === 'Good')
   

  const handleNetworkCheck = async () => {
    setNetworkStatus('loading')
    const result = await checkInternet()
    setNetworkStatus(result)
  }

  const getNetworkColor = () => {
    if (networkStatus === 'loading') return 'bg-gray-400'
    if (networkStatus === 'Excellent' || networkStatus === 'Good') return 'bg-green-500'
    if (networkStatus === 'Poor') return 'bg-red-600'
    return 'bg-gray-400'
  }

  const getNetworkMessage = () => {
    if (networkStatus === 'loading') return 'Checking...'
    if (networkStatus === 'Excellent' || networkStatus === 'Good') return 'Connection is good'
    if (networkStatus === 'Poor') return 'Connection is poor'
    return 'Check your connection'
  }
  
  return (
    <div className="w-full h-full flex flex-col rounded-2xl bg-white border border-slate-200 shadow-md overflow-auto">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-slate-900">Pre-interview checks</h2>
        </div>
        <p className="text-xs text-slate-600 ml-7">Please verify your setup is ready</p>
      </div>

      <div className="flex-1 flex flex-col gap-3 p-5 overflow-y-auto">
        {/* Microphone Check */}
        <div className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition"
        onClick={() => {
          if(audioStatus !== 'success') startMedia()
        }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0 mt-0.5">
              <Mic className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">Microphone</p>
              <p className="text-xs text-slate-500 mt-0.5">{audioStatus === 'success' ? 'Audio is working' : audioStatus === 'failed' ? 'Audio is not working' : 'Start the audio...'}</p>
            </div>
          </div>
          <div className="ml-9 flex items-center gap-2 text-xs">
            <div className={`h-2 w-2 rounded-full ${audioStatus === 'success' ? 'bg-green-500' : 'bg-red-600'}`}></div>
            <span className="text-emerald-700 font-medium">{audioStatus === 'success' ? 'Ready' : audioStatus === 'failed' ? 'Not Working' : 'Not Started'}</span>
          </div>
        </div>

        {/* Camera Check */}
        <div className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition"
         onClick={() => {
          if(videoStatus !== 'success') startMedia()
          }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700 flex-shrink-0 mt-0.5">
              <Camera className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">Camera</p>
              <p className="text-xs text-slate-500 mt-0.5">{videoStatus === 'success' ? 'Video is working' : videoStatus === 'failed' ? 'Video is not working' : 'Start the video...'}</p>
            </div>
          </div>
          <div className="ml-9 flex items-center gap-2 text-xs">
            <div className={`h-2 w-2 rounded-full ${videoStatus==="success" ? 'bg-green-500' :'bg-red-600'} `}></div>
            <span className="text-emerald-700 font-medium">{videoStatus === 'success' ? 'Working' : videoStatus === 'failed' ? 'Not Working' : 'Not Started'}</span>
          </div>
        </div>

        {/* Network Check */}
        <div className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition cursor-pointer"
        onClick={handleNetworkCheck}>
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 flex-shrink-0 mt-0.5">
              <Wifi className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">Connection</p>
              <p className="text-xs text-slate-500 mt-0.5">{getNetworkMessage()}</p>
            </div>
          </div>
          <div className="ml-9 flex items-center gap-2 text-xs">
            <div className={`h-2 w-2 rounded-full ${getNetworkColor()}`}></div>
            <span className="text-emerald-700 font-medium">{networkStatus === 'not-started' ? 'Click to check' : networkStatus === 'loading' ? 'Checking' : networkStatus}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 p-4 bg-slate-50">
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-600">💡 Tip: Close other apps and keep this tab active during the interview</p>
          {allChecksPassed && (
            <Button 
              onClick={onStartInterview}
              disabled={!allChecksPassed}
              className={` ${allChecksPassed} ? '' : 'opacity-50 cursor-not-allowed'} w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition`}
            >
              <Play className="h-4 w-4" />
              Start Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckYourTech

