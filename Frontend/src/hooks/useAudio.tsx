// import { useState, useRef } from "react";

// type AudioStatus = 'loading' | 'success' | 'failed';

// export function useAudio() {
//   const [audioStatus, setAudioStatus] = useState<AudioStatus>('loading');
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   const startAudio = async () => {
//     try {
//       // Only request if we don't have a stream yet
//       if (!audioRef.current) {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         audioRef.current = stream;
//       }
//       setAudioStatus('success');
//       console.log("Microphone access granted");
//     } catch (err) {
//       setAudioStatus('failed');
//       console.error("Microphone access denied", err);
//     }
//   };

//   const stopAudio = () => {
//     if (audioRef.current) {
//       audioRef.current.getTracks().forEach(track => track.stop());
//       audioRef.current = null;
//       setAudioStatus('loading');
//     }
//   };

//   return {
//     audioStatus,
//     audioRef,
//     startAudio,
//     stopAudio,
//   };
// }
