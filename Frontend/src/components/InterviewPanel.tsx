import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, PhoneOff, Settings, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { io, Socket} from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

interface InterviewPanelProps {
  videoStatus: string; 
  audioStatus: string;
  stream: MediaStream | null;
}



const InterviewPanel = ({ videoStatus, stream }: InterviewPanelProps) => {
  
  const [status, setStatus] = useState('speaking') // 'speaking', 'listening', 'thinking'
  const [aiQuestion, setAiQuestion] = useState("...")
  const [candidateTranscript, setCandidateTranscript] = useState("")
  const questionRef = useRef<string|null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const socketRef = useRef<Socket |null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isProcessingRef = useRef(false)
  const recognitionRef = useRef<any>(null)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [isEnding, setIsEnding] = useState(false)
  const navigate = useNavigate()
  const isLastQuestionRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)

  // Extract interviewId and rawToken from URL
  const currentUrl = window.location.pathname
  const pathSegments = currentUrl.split('/')
  const interviewId = pathSegments[2]  
  // const rawToken = pathSegments[3]

  const handleEndInterview = useCallback(async () => {
    setIsEnding(true)
     // Stop all media
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop()
    if (recognitionRef.current) recognitionRef.current.stop()
    window.speechSynthesis.cancel()
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interview/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId })
      })
      
      if (response.ok) {
        // Redirect to the "Thank You" page
        navigate('/interview-complete', { replace: true })
      }
      else {
        setIsEnding(false);
        alert("Failed to end interview properly. Please try again.")
      }
    } catch (err) {
      console.error("Error ending interview", err)
      setIsEnding(false)
    }
  },[interviewId, navigate])

  // Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleEndInterview()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

   // format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const startLiveTranscription = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            //  final sentence
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }
        setCandidateTranscript(interimTranscript) 
      }

    recognitionRef.current.start()
  }

  const startListening = () => {
    if(!stream) return
    
    isProcessingRef.current = false
    const audioStream = new MediaStream(stream.getAudioTracks())

     const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
                   ? 'audio/webm;codecs=opus' 
                   : 'audio/webm'
    
    mediaRecorderRef.current = new MediaRecorder(audioStream, { mimeType })
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      console.warn('WebM/opus not supported, using default')
    }

    audioContextRef.current = new AudioContext()
    const source = audioContextRef.current.createMediaStreamSource(stream)
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 256
    source.connect(analyserRef.current)
    

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)


    mediaRecorderRef.current.ondataavailable = (event) => {
      if(event.data.size > 0 && socketRef.current) {
          socketRef.current.emit("audio-chunk", {
            interviewId,
            chunk: event.data // Binary blob
          })
      }
    }   
    const checkSilence = () => {  
        // if(status != "listening"){
        //   if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
        //   return
        // }

         if (isProcessingRef.current) {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
            return
        }
         if (!analyserRef.current) return

        analyserRef.current?.getByteFrequencyData(dataArray)
        // calculate the average volume 
        const sum = dataArray.reduce((a,b)=>a+b,0)
        const averageVol = sum / bufferLength
        const SILENCE_THRESHOLD = 18

        if(averageVol > SILENCE_THRESHOLD) {
          console.log("Voice detected, volume:", averageVol)
          resetSilenceTimer()
        }
        rafIdRef.current=requestAnimationFrame(checkSilence)

    }
    rafIdRef.current = requestAnimationFrame(checkSilence)
    
    mediaRecorderRef.current.start(200) // 200ms interval
    resetSilenceTimer()
  }

  const resetSilenceTimer = () => {
     if(silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

      silenceTimerRef.current =setTimeout(()=>{
        console.log("Silence detected for 5 seconds. Stopping...")
        handleTranscriptionComplete()
      },10000) // 8 seconds
  }

  const handleTranscriptionComplete = useCallback(() => {
    if (isProcessingRef.current) return;
      isProcessingRef.current = true
    
    if(mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }  
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if(recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setStatus("thinking")
    socketRef.current?.emit("candidate-finished-speaking", { interviewId, questionId: questionRef.current})
    
  }, [interviewId])

  useEffect(() => {
    if(status === "listening"){
      // Start recording
      startListening()
      startLiveTranscription()
    }
    else{
       if (status === 'speaking' || status === 'thinking') {

            if (rafIdRef.current) {
              cancelAnimationFrame(rafIdRef.current)
              rafIdRef.current = null
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop()
            }
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current)
                silenceTimerRef.current = null
            }
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            if (audioContextRef.current) {
                audioContextRef.current.close()
                audioContextRef.current = null
            }
      }
    }
    return () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  },[status])

  // speak(TTS)
  const speak = useCallback((text: string, onDone: () => void) => {
    // Cancel any current speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // 
    let voices = window.speechSynthesis.getVoices()

    const femaleVoice =
    voices.find(v =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("zira") ||
      v.name.toLowerCase().includes("samantha")
    ) || voices[0]

    utterance.voice = femaleVoice

    // M
    utterance.rate = 0.95
    utterance.pitch = 1.1
    utterance.volume = 1

    utterance.onend = onDone

    window.speechSynthesis.speak(utterance)
  },[]) 
   
  
  useEffect(() => {

    if (status === "speaking") {
      speak(aiQuestion, () => {
        if (isLastQuestionRef.current) {
          handleEndInterview()
        } else {
          setStatus("listening")
        }
      })
    }
  }, [status, aiQuestion])

  useEffect(() => {
    // connect to Socket.IO server
    socketRef.current = io(import.meta.env.VITE_API_URL)

    // join room
    socketRef.current.emit("join-interview", { interviewId })   

    // listen for the question
    socketRef.current.on("next-question", ({ question,questionId, status,isLast }: { question: string;questionId: string;  status: string; isLast: boolean }) => {
      setAiQuestion(question)
      questionRef.current = questionId
      isLastQuestionRef.current = isLast
      setCandidateTranscript("")
      isProcessingRef.current = false
      setStatus(status) // speaking
    })

    return ()=>{
      if (socketRef.current) socketRef.current.disconnect()
    }
  },[interviewId])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream])



  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-slate-900">
      {/* --- BLURRY LOADING OVERLAY --- */}
      {isEnding && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center backdrop-blur-md bg-white/30 transition-all duration-500">
           <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-orange-500 animate-spin" />
           </div>
           <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Finalizing Interview</h2>
              <p className="text-slate-500 text-sm mt-2">Uploading your responses and generating report...</p>
           </div>
        </div>
      )}
      
      {/* --- LEFT SIDE: THE INTERACTION --- */}
      <div className="flex flex-col flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">C</div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Cuemath Tutor Screening</h1>
              <p className="text-sm text-slate-500 font-medium">Candidate: John Doe</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
            <span className={`text-sm font-semibold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
              Time Left: {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* UPDATED: NEW TRANSCRIPT AREA STRUCTURE */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-6">
          
          {/* 1. AI SECTION: Shows the Question */}
          {/* <div className={`transition-all duration-700 transform ${status === 'speaking' ? 'scale-105 opacity-100' : 'scale-100 opacity-50'}`}>
            <div className="flex flex-col items-center">
              <div className="mb-4 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                AI Interviewer
              </div>
              <h2 className={`text-md font-bold text-slate-800 text-center leading-tight ${aiQuestion==="..." ?'animate-bounce':''} `}>
              {aiQuestion} 
              </h2>
            </div>
          </div> */}
          <div className={`transition-all duration-700 transform ${status === 'speaking' ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}>
          <div className="flex flex-col items-center max-w-2xl">
            <div className="mb-4 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {status === 'thinking' ? 'AI is thinking...' : 'AI Interviewer'}
            </div>
            <h2 className="text-sm md:text-md font-medium text-slate-800 text-center leading-relaxed">
              {aiQuestion === "..." ? "Connecting to interviewer..." : aiQuestion}
            </h2>
          </div>
        </div>

          {/* 2. CENTER ICON & TRANSITION: The "Heart" of the UI */}
          <div className="h-48 flex items-center justify-center w-full relative">
            {/* Thinking Dots - Shown only when AI is processing */}
            {status === 'thinking' ? (
               <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
               </div>
            ) : (
              /* The pulsing Mic icon when active */
              <div className="relative">
                {status === 'listening' && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping" />
                    <div className="absolute inset-0 rounded-full bg-blue-400 opacity-10 animate-pulse scale-150" />
                  </>
                )}
                <div className={`relative w-20 h-20 rounded-full shadow-xl flex items-center justify-center border-4 border-white overflow-hidden transition-colors duration-500 ${status === 'speaking' ? 'bg-orange-500' : 'bg-blue-600'}`}>
                  <Mic className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* 3. CANDIDATE SECTION: Live transcription of their answer */}
          <div className={`w-full transition-all duration-500 ${status === 'listening' ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'}`}>
            <div className="flex flex-col items-center">
              <div className="mb-4 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                You (Live Answer)
              </div>
              <p className="text-sm text-slate-500 text-center italic font-medium max-w-xl leading-relaxed">
                "{candidateTranscript || "I'm listening..."}"
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <Button variant="outline" size="icon" className="w-14 h-14 rounded-full border-slate-200 hover:bg-slate-100">
            <Settings className="w-6 h-6 text-slate-600" />
          </Button>
          
          <Button 
          variant="destructive" 
          className="px-8 h-14 rounded-full gap-3 shadow-lg shadow-red-200 transition-all hover:scale-105"
          onClick={handleEndInterview}>
            <PhoneOff className="w-5 h-5" />
            <span className="font-bold">End Interview</span>
          </Button>

          <Button variant="outline" size="icon" className="w-14 h-14 rounded-full border-slate-200 hover:bg-slate-100">
            <MessageSquare className="w-6 h-6 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* --- RIGHT SIDE: VIDEO FEED --- */}
      <div className="w-[400px] bg-white border-l border-slate-200 p-8 flex flex-col">
        <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Self View</h3>
            <div className="relative aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50">
                <video
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    videoStatus !== 'success' ? 'opacity-0' : 'opacity-100'
                  }`}
                  autoPlay
                  playsInline
                  muted
                />
                
                {/* Overlay details on video */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-medium">John Doe</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-white/80 font-mono tracking-widest">LIVE RECORDING</span>
                    </div>
                </div>
                
                {/* Visualizer overlay: Animated bars that react to voice */}
                <div className="absolute bottom-20 left-6 flex items-end gap-1 h-8">
                    {[2, 5, 8, 4, 3, 6, 4, 7].map((h, i) => (
                        <div key={i} className={`w-1 bg-white/60 rounded-full transition-all duration-150 ${status === 'listening' ? 'animate-bounce' : 'h-1'}`} style={{ height: `${h * 10}%`, animationDelay: `${i * 0.05}s` }} />
                    ))}
                </div>
            </div>
        </div>

        {/* Progress Card */}
        <div className="mt-auto bg-[#FFF7ED] p-6 rounded-2xl border border-orange-100">
            <h4 className="text-orange-700 font-bold text-sm mb-2 flex items-center gap-2">
               <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
               Cuemath Tip
            </h4>
            <p className="text-orange-800/70 text-sm leading-relaxed">
              When explaining, imagine Rohan is right in front of you. Keep your tone warm and use high energy!
            </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewPanel;