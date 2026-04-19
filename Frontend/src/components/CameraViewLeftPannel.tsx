import { Camera } from 'lucide-react'
import { useEffect, useRef } from 'react';


function CameraViewLeftPannel({  videoStatus,stream }: {  videoStatus: string, stream: MediaStream | null }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
  if (videoRef.current && stream) {
    videoRef.current.srcObject = stream;
  }
}, [stream])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center shadow-md rounded-2xl bg-linear-to-br from-slate-900 to-slate-800  overflow-hidden cursor-auto relative">
      
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${videoStatus === 'success' ? 'block' : 'hidden'}`}
        autoPlay
        playsInline
        muted
      />

      {/* Loading spinner */}
      {videoStatus === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-4 absolute inset-0">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-600 border-t-blue-500 animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-100 font-medium text-sm">Requesting camera access...</p>
            <p className="text-slate-400 text-xs mt-1">Please allow camera permission in your browser</p>
          </div>
        </div>
      )}

      {/* Failed state */}
      {videoStatus === 'failed' && (
        <div className="flex flex-col items-center justify-center gap-4 absolute inset-0">
          <div className="p-5 rounded-3xl bg-slate-700/50">
            <Camera className="w-12 h-12 text-slate-300" strokeWidth={1.5} />
          </div>
          <div className="text-center px-6">
            <p className="text-slate-100 font-medium">Camera permission denied</p>
            <p className="text-slate-400 text-sm mt-2">Enable camera in browser settings</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CameraViewLeftPannel