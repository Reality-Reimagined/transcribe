import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Headphones, Languages, Upload, Wand2, Volume2, FileAudio, Loader2, Clock, Download, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Groq from 'groq-sdk';
import { Logo } from './Logo';
import { WaveformPlayer } from './WaveformPlayer';
import { DownloadOptions } from './DownloadOptions';

type Word = {
  word: string;
  start: number;
  end: number;
};

type Segment = {
  text: string;
  start: number;
  end: number;
  words?: Word[];
};

type TranscriptionResult = {
  text: string;
  language?: string;
  segments?: Segment[];
  words?: Word[];
  duration?: number;
};

type Mode = 'transcribe' | 'translate' | 'timestamps' | 'words';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [mode, setMode] = useState<Mode>('transcribe');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const audioFile = acceptedFiles[0];
    if (audioFile) {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setFile(audioFile);
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
      setResult(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.flac', '.mp4', '.mpeg', '.mpga', '.webm']
    },
    maxFiles: 1
  });

  const seekToTimestamp = (time: number) => {
    if (wavesurfer) {
      wavesurfer.setTime(time);
      wavesurfer.play();
    }
  };

  const processAudio = async () => {
    if (!file) return;

    setIsProcessing(true);
    const loadingToast = toast.loading(
      mode === 'timestamps' ? 'Processing timestamps...' : 
      mode === 'words' ? 'Processing word timestamps...' :
      mode === 'transcribe' ? 'Transcribing audio...' : 
      'Translating audio...'
    );

    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });

      let response;
      if (mode === 'transcribe' || mode === 'timestamps' || mode === 'words') {
        response = await groq.audio.transcriptions.create({
          file: file,
          model: 'whisper-large-v3',
          response_format: 'verbose_json',
          timestamp_granularities: ['word', 'segment']
        });
        console.log('Response:', response);
        setResult({
          text: response.text,
          segments: response.segments,
          words: response.words,
          duration: response.duration,
          language: response.language
        });
      } else {
        response = await groq.audio.translations.create({
          file: file,
          model: 'whisper-large-v3',
          response_format: 'verbose_json',
        });
        console.log('Translate response:', response);
        setResult({
          text: response.text,
          segments: response.segments,
          words: response.words,
          language: 'English',
          duration: response.duration
        });
      }
      
      toast.success('Processing complete!', { id: loadingToast });
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process audio. Please try again.', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  const textAnimationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Toaster position="top-center" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Logo className="w-48 h-48" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6">
          Chronosphere
        </h1>

        <div className="flex flex-col gap-2 mb-12">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={textAnimationVariants}
            className="text-xl text-gray-700 font-medium"
          >
            Transcribe, translate, and unlock detailed timestamps
          </motion.p>
          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textAnimationVariants}
            className="text-xl text-gray-600"
          >
            for your audio files with precision.
          </motion.p>
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textAnimationVariants}
            className="text-xl text-gray-600"
          >
          </motion.p>
        </div>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('transcribe')}
            className={`btn-mode btn-mode-transcribe ${
              mode === 'transcribe'
                ? 'btn-mode-active bg-gradient-to-r from-indigo-600 to-purple-600'
                : 'bg-white text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Transcribe</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('translate')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              mode === 'translate'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              <span>Translate</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('timestamps')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              mode === 'timestamps'
                ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Segments</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('words')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              mode === 'words'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Words</span>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div
            {...getRootProps()}
            className={`border-3 border-dashed rounded-xl p-8 transition-all duration-300 transform ${
              isDragActive 
                ? 'border-indigo-400 bg-indigo-50/80 scale-102 shadow-lg ring-4 ring-indigo-200 ring-opacity-50' 
                : 'border-gray-300 hover:border-indigo-300 hover:shadow-md hover:ring-2 hover:ring-indigo-100 bg-white/90'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ 
                  y: isDragActive ? -10 : 0,
                  scale: isDragActive ? 1.1 : 1
                }}
                transition={{ type: "spring" }}
              >
                <Upload className={`w-12 h-12 mb-4 transition-colors duration-300 ${
                  isDragActive ? 'text-indigo-500' : 'text-gray-400'
                }`} />
              </motion.div>
              <p className={`font-medium transition-colors duration-300 ${
                isDragActive ? 'text-indigo-600' : 'text-gray-600'
              }`}>
                {isDragActive
                  ? "Drop your audio file here"
                  : "Drag & drop your audio file here, or click to select"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: MP3, WAV, M4A, FLAC, MP4, OGG
              </p>
            </div>
          </div>

          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-6 glass-effect rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <FileAudio className="w-6 h-6 text-indigo-600" />
                <p className="text-gray-700 font-medium">{file.name}</p>
              </div>
              
              {audioUrl && (
                <WaveformPlayer 
                  audioUrl={audioUrl}
                  onReady={setWavesurfer}
                />
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={processAudio}
                disabled={isProcessing}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>
                      {mode === 'timestamps' ? 'Generate Timestamps' :
                       mode === 'words' ? 'Generate Word Timestamps' :
                       mode === 'transcribe' ? 'Start Transcription' :
                       'Start Translation'}
                    </span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 p-6 bg-white rounded-lg shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      {mode === 'timestamps' ? 'Timestamped Result' :
                       mode === 'words' ? 'Word-by-Word Result' :
                       mode === 'transcribe' ? 'Transcription Result' :
                       'Translation Result'}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      {result.language && (
                        <span>Language: {result.language}</span>
                      )}
                      {result.duration && (
                        <span>Duration: {formatDuration(result.duration)}</span>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDownloadOptions(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                </div>

                <div className="results-container">
                  {mode === 'timestamps' && result.segments ? (
                    <div className="space-y-4">
                      {result.segments.map((segment, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <button
                              onClick={() => seekToTimestamp(segment.start)}
                              className="text-sm text-indigo-600 hover:text-indigo-800 font-mono"
                            >
                              {formatTime(segment.start)} - {formatTime(segment.end)}
                            </button>
                          </div>
                          <p className="text-gray-600">{segment.text}</p>
                          {segment.words && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {segment.words.map((word, wordIndex) => (
                                <button
                                  key={wordIndex}
                                  onClick={() => seekToTimestamp(word.start)}
                                  className="text-sm bg-white px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                                >
                                  {word.word}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : mode === 'words' && result.words ? (
                    <div className="space-y-2">
                      {result.words.map((word, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => seekToTimestamp(word.start)}
                          className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-mono text-sm text-indigo-600">
                            [{formatTime(word.start)}]
                          </span>
                          <span className="ml-3 text-gray-700">
                            {word.word}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 whitespace-pre-wrap">{result.text}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DownloadOptions
            isOpen={showDownloadOptions}
            onClose={() => setShowDownloadOptions(false)}
            content={result?.text || ''}
            fileName={`chronosphere-${new Date().toISOString().split('T')[0]}`}
            mode={mode}
            segments={result?.segments}
            words={result?.words}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;