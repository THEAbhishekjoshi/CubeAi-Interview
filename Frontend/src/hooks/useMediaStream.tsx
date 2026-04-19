import { useState, useCallback } from "react";

export type Status = 'not-started' | 'loading' | 'success' | 'failed'

export function useMediaStream() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [videoStatus, setVideoStatus] = useState<Status>('not-started')
  const [audioStatus, setAudioStatus] = useState<Status>('not-started')

  const startMedia = useCallback(async () => {
    setVideoStatus('loading')
    setAudioStatus('loading')

    try {
      // Don't re-open if already open
      if (stream) return stream;

      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })

      // Check if we actually got video tracks
      if (newStream.getVideoTracks().length > 0) {
        setVideoStatus('success')
      } else {
        setVideoStatus('failed')
      }

      // Check if we actually got audio tracks
      if (newStream.getAudioTracks().length > 0) {
        setAudioStatus('success')
      } else {
        setAudioStatus('failed')
      }

      setStream(newStream)
      return newStream
    } catch (err) {
      setVideoStatus('failed')
      setAudioStatus('failed')
      console.error("Media access denied", err)
    }
  }, [])

  return { stream, videoStatus, audioStatus, startMedia }
}