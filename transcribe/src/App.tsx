import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Headphones, Languages, Upload, Wand2, Volume2, FileAudio, Loader2, Clock, Download } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Groq from 'groq-sdk';

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
};

type Mode = 'transcribe' | 'translate' | 'timestamps' | 'words';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [mode, setMode] = useState<Mode>('transcribe');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const audioFile = acceptedFiles[0];
    if (audioFile) {
      setFile(audioFile);
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
      const audio = new Audio(url);
      setAudioElement(audio);
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
      if (mode === 'timestamps') {
        response = await groq.audio.transcriptions.create({
          file: file,
          model: 'whisper-large-v3',
          response_format: 'verbose_json',
          timestamp_granularities: ['word', 'segment']
        });
        setResult({
          text: response.text,
          segments: response.segments
        });
      } else if (mode === 'words') {
        response = await groq.audio.transcriptions.create({
          file: file,
          model: 'whisper-large-v3',
          response_format: 'verbose_json',
          timestamp_granularities: ['word']
        });
        
        // Extract words directly from the response
        const allWords = response.segments.reduce((words: Word[], segment) => {
          if (segment.words) {
            words.push(...segment.words);
          }
          return words;
        }, []);

        setResult({
          text: response.text,
          words: allWords
        });
      } else if (mode === 'transcribe') {
        response = await groq.audio.transcriptions.create({
          file: file,
          model: 'whisper-large-v3',
          response_format: 'json'
        });
        setResult({
          text: response.text,
          language: 'Detected'
        });
      } else {
        response = await groq.audio.translations.create({
          file: file,
          model: 'whisper-large-v3',
          response_format: 'json'
        });
        setResult({
          text: response.text,
          language: 'English'
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

  const seekToTimestamp = (time: number) => {
    if (audioElement) {
      audioElement.currentTime = time;
      audioElement.play();
    }
  };

  const downloadTranscript = () => {
    if (!result) return;

    let content = '';
    if (mode === 'timestamps' && result.segments) {
      content = result.segments.map(segment => 
        `[${formatTime(segment.start)} - ${formatTime(segment.end)}]\n${segment.text}\n`
      ).join('\n');
    } else if (mode === 'words' && result.words) {
      content = result.words.map(word => 
        `[${formatTime(word.start)}] ${word.word}`
      ).join('\n');
    } else {
      content = result.text;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Toaster position="top-center" />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center space-x-4 mb-8"
        >
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring" }}
          >
            <Headphones className="w-12 h-12 text-indigo-600" />
          </motion.div>
          <motion.div
            whileHover={{ rotate: -15 }}
            transition={{ type: "spring" }}
          >
            <Languages className="w-12 h-12 text-purple-600" />
          </motion.div>
        </motion.div>
        
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
          Audio Intelligence Hub
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Transform your audio into text with advanced AI. Transcribe, translate, or get detailed timestamps for your audio files.
        </p>

        {/* Mode Selection */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('transcribe')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              mode === 'transcribe'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
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

        {/* Dropzone */}
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
                ? 'border-indigo-400 bg-indigo-50 scale-102 shadow-lg ring-4 ring-indigo-200 ring-opacity-50' 
                : 'border-gray-300 hover:border-indigo-300 hover:shadow-md hover:ring-2 hover:ring-indigo-100'
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
              className="mt-4 p-6 bg-white rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <FileAudio className="w-6 h-6 text-indigo-600" />
                <p className="text-gray-700 font-medium">{file.name}</p>
              </div>
              
              {audioUrl && (
                <audio 
                  controls 
                  className="w-full mb-4"
                  ref={(audio) => {
                    if (audio) setAudioElement(audio);
                  }}
                >
                  <source src={audioUrl} type={file.type} />
                  Your browser does not support the audio element.
                </audio>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={processAudio}
                disabled={isProcessing}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transition-shadow"
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

          {/* Results */}
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
                  <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {mode === 'timestamps' ? 'Timestamped Result' :
                     mode === 'words' ? 'Word-by-Word Result' :
                     mode === 'transcribe' ? 'Transcription Result' :
                     'Translation Result'}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadTranscript}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                </div>

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
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {result.words.map((word, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => seekToTimestamp(word.start)}
                          className="inline-flex items-center bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow transition-all group"
                        >
                          <span className="text-gray-600 group-hover:text-indigo-600 transition-colors">
                            {word.word}
                          </span>
                          <span className="text-xs text-gray-400 font-mono ml-2">
                            {formatTime(word.start)}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 whitespace-pre-wrap">{result.text}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;