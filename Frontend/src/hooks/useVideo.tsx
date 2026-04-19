// import { useState, useRef } from "react";

// type VideoStatus = 'loading' | 'success' | 'failed';

// export function useVideo() {
//   const [videoStatus, setVideoStatus] = useState<VideoStatus>('loading');
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const startVideo = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       console.log("Stream obtained from getUserMedia", videoRef);
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         setVideoStatus('success');
//       }
//       console.log("Camera access granted",videoStatus);
//     } catch (err) {
//       setVideoStatus('failed');
//       console.error("Camera access denied", err);
//     }
//   };

//   return {
//     videoStatus,
//     videoRef,
//     startVideo,
//   };
// }