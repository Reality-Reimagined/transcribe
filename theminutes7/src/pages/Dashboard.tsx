import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FileAudio, Plus, Clock, Languages, Download, Trash2, Edit, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import { TranscriptSearch } from '../components/TranscriptSearch';
import { generateTranscriptSummary } from '../lib/summarize';
import { DownloadOptions } from '../DownloadOptions';
import { marked } from 'marked';
import toast from 'react-hot-toast';

interface Transcription {
  id: string;
  title: string;
  original_filename: string;
  content: string;
  created_at: string;
  duration: number;
  language: string;
  summary?: string;
  segments?: Array<{
    text: string;
    start: number;
    end: number;
    words?: Array<{
      word: string;
      start: number;
      end: number;
    }>;
  }>;
  words?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}

type ViewMode = 'text' | 'segments' | 'words';

export function Dashboard() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [filteredTranscriptions, setFilteredTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState<Record<string, boolean>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('text');
  const [shareEmail, setShareEmail] = useState('');
  const [showShareDialog, setShowShareDialog] = useState<string | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTranscriptions() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('transcriptions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setTranscriptions(data || []);
        setFilteredTranscriptions(data || []);
      } catch (error) {
        console.error('Error fetching transcriptions:', error);
        toast.error('Failed to fetch transcriptions');
      } finally {
        setLoading(false);
      }
    }

    fetchTranscriptions();
  }, [user]);

  const handleSearch = (query: string) => {
    const filtered = transcriptions.filter(t => 
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.content.toLowerCase().includes(query.toLowerCase()) ||
      (t.summary && t.summary.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredTranscriptions(filtered);
  };

  const generateSummary = async (transcription: Transcription) => {
    setSummarizing(prev => ({ ...prev, [transcription.id]: true }));
    try {
      let contentToSummarize = '';
      const mode = viewMode === 'segments' ? 'timestamps' : 'text';

      if (viewMode === 'segments' && transcription.segments) {
        contentToSummarize = transcription.segments
          .map(segment => `[${formatTime(segment.start)} - ${formatTime(segment.end)}] ${segment.text}`)
          .join('\n\n');
      } else {
        contentToSummarize = transcription.content;
      }

      const summary = await generateTranscriptSummary(contentToSummarize, mode);
      
      const { error } = await supabase
        .from('transcriptions')
        .update({ summary })
        .eq('id', transcription.id);

      if (error) throw error;

      const updateTranscription = (t: Transcription) => 
        t.id === transcription.id ? { ...t, summary } : t;
      
      setTranscriptions(prev => prev.map(updateTranscription));
      setFilteredTranscriptions(prev => prev.map(updateTranscription));
      
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setSummarizing(prev => ({ ...prev, [transcription.id]: false }));
    }
  };

  const deleteTranscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTranscriptions(prev => prev.filter(t => t.id !== id));
      setFilteredTranscriptions(prev => prev.filter(t => t.id !== id));
      toast.success('Transcription deleted');
    } catch (error) {
      console.error('Error deleting transcription:', error);
      toast.error('Failed to delete transcription');
    }
  };

  const shareTranscription = async (transcription: Transcription, email: string) => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const content = `
        Transcript: ${transcription.title}
        
        Content:
        ${transcription.content}
        
        ${transcription.summary ? `\nSummary:\n${transcription.summary}` : ''}
      `;

      const mailtoLink = `mailto:${email}?subject=Shared Transcript: ${transcription.title}&body=${encodeURIComponent(content)}`;
      window.location.href = mailtoLink;

      setShowShareDialog(null);
      setShareEmail('');
      toast.success('Email client opened with transcript');
    } catch (error) {
      console.error('Error sharing transcription:', error);
      toast.error('Failed to share transcription');
    }
  };

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setViewMode('text');
    }
  };

  const renderMarkdown = (content: string) => {
    marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: false
    });
    return { __html: marked(content) };
  };

  const renderTranscriptionContent = (transcription: Transcription) => {
    switch (viewMode) {
      case 'segments':
        return transcription.segments ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
            {transcription.segments.map((segment, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-indigo-600 font-mono">
                    {formatTime(segment.start)} - {formatTime(segment.end)}
                  </span>
                </div>
                <p className="text-gray-600">{segment.text}</p>
                {segment.words && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {segment.words.map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className="text-sm bg-white px-2 py-1 rounded"
                      >
                        {word.word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No segments available</p>
        );

      case 'words':
        return transcription.words ? (
          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
            {transcription.words.map((word, index) => (
              <div
                key={index}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-mono text-sm text-indigo-600">
                  [{formatTime(word.start)}]
                </span>
                <span className="ml-3 text-gray-700">
                  {word.word}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No word timestamps available</p>
        );

      default:
        return (
          <div className="bg-gray-50 p-4 rounded-lg max-h-[500px] overflow-y-auto custom-scrollbar">
            <p className="text-gray-600 whitespace-pre-wrap">{transcription.content}</p>
          </div>
        );
    }
  };

  const getDownloadMode = (viewMode: ViewMode): 'transcribe' | 'timestamps' | 'words' => {
    switch (viewMode) {
      case 'segments':
        return 'timestamps';
      case 'words':
        return 'words';
      default:
        return 'transcribe';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Transcriptions</h1>
          <p className="mt-2 text-gray-600">Manage and access your meeting transcriptions</p>
        </div>
        <Link
          to="/transcribe"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all hover:scale-105 transform"
        >
          <Plus className="w-5 h-5" />
          <span>New Transcription</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : transcriptions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-2xl shadow-sm"
        >
          <FileAudio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transcriptions yet</h3>
          <p className="text-gray-500 mb-6">Start by creating your first transcription</p>
          <Link
            to="/transcribe"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all hover:scale-105 transform"
          >
            <Plus className="w-5 h-5" />
            <span>New Transcription</span>
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="mb-6">
            <TranscriptSearch onSearch={handleSearch} />
          </div>
          <div className="space-y-4">
            {filteredTranscriptions.map((transcription, index) => (
              <motion.div
                key={transcription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(transcription.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {transcription.title}
                        </h3>
                        {expandedId === transcription.id ? 
                          <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        }
                      </div>
                      <p className="text-sm text-gray-500">{transcription.original_filename}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowShareDialog(transcription.id);
                        }}
                        className="p-2 text-gray-500 hover:text-indigo-600 transition-colors rounded-full hover:bg-gray-100"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTranscription(transcription.id);
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/transcribe/${transcription.id}`);
                        }}
                        className="p-2 text-gray-500 hover:text-indigo-600 transition-colors rounded-full hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(transcription.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Languages className="w-4 h-4" />
                      <span className="capitalize">{transcription.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">{formatDate(transcription.created_at)}</span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showShareDialog === transcription.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                      onClick={() => setShowShareDialog(null)}
                    >
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4"
                        onClick={e => e.stopPropagation()}
                      >
                        <h3 className="text-lg font-semibold mb-4">Share Transcription</h3>
                        <input
                          type="email"
                          value={shareEmail}
                          onChange={(e) => setShareEmail(e.target.value)}
                          placeholder="Enter email address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowShareDialog(null)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => shareTranscription(transcription, shareEmail)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Share
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {expandedId === transcription.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t"
                    >
                      <div className="p-6 bg-gray-50">
                        <div className="flex items-center gap-4 mb-6">
                          {['text', 'segments', 'words'].map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setViewMode(mode as ViewMode)}
                              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                                viewMode === mode
                                  ? 'bg-indigo-600 text-white shadow-lg'
                                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                              }`}
                            >
                              {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                          ))}
                        </div>

                        <div className="prose max-w-none bg-white rounded-lg p-6 shadow-sm mb-6">
                          <h4 className="text-lg font-semibold mb-4">Transcript</h4>
                          {renderTranscriptionContent(transcription)}
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                          {transcription.summary ? (
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                              <h4 className="font-semibold mb-4">Summary</h4>
                              <div 
                                className="prose prose-sm max-w-none markdown-content max-h-[300px] overflow-y-auto custom-scrollbar"
                                dangerouslySetInnerHTML={renderMarkdown(transcription.summary)}
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => generateSummary(transcription)}
                              disabled={summarizing[transcription.id]}
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow hover:shadow-lg"
                            >
                              {summarizing[transcription.id] ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                                  <span>Generating Summary...</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  <span>Generate Summary</span>
                                </>
                              )}
                            </button>
                          )}
                          
                          <button 
                            onClick={() => setShowDownloadOptions(transcription.id)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors border-2 border-indigo-600 shadow hover:shadow-lg"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Transcript</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <DownloadOptions
                    isOpen={showDownloadOptions === transcription.id}
                    onClose={() => setShowDownloadOptions(null)}
                    content={transcription.content}
                    fileName={`${transcription.title}-${formatDate(transcription.created_at)}`}
                    mode={getDownloadMode(viewMode)}
                    segments={transcription.segments}
                    words={transcription.words}
                  />
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}