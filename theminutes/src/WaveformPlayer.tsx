import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformPlayerProps {
  audioUrl: string;
  onReady?: (wavesurfer: WaveSurfer) => void;
}

export function WaveformPlayer({ audioUrl, onReady }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#6366f1',
      progressColor: '#4f46e5',
      cursorColor: '#818cf8',
      barWidth: 2,
      barGap: 1,
      height: 60,
      normalize: true,
      backend: 'WebAudio',
      dragToSeek: true
    });

    wavesurfer.load(audioUrl);
    wavesurferRef.current = wavesurfer;

    wavesurfer.on('ready', () => {
      if (onReady) onReady(wavesurfer);
    });

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-inner">
      <div ref={containerRef} className="mb-2 cursor-pointer" />
      <button
        onClick={handlePlayPause}
        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}