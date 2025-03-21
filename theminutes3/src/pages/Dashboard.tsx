import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileAudio, Plus, Clock, Languages, Download, Trash2, Edit, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import { TranscriptSearch } from '../components/TranscriptSearch';
import { generateTranscriptSummary } from '../lib/summarize';
import toast from 'react-hot-toast';
// Add this import at the top of the file
import { injectMockData } from '../lib/mockData';

interface Transcription {
  id: string;
  title: string;
  original_filename: string;
  content: string;
  created_at: string;
  duration: number;
  language: string;
  summary?: string;
}

export function Dashboard() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [filteredTranscriptions, setFilteredTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState<Record<string, boolean>>({});
  const { user } = useAuthStore();

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
      } finally {
        setLoading(false);
      }
    }

    fetchTranscriptions();
  }, [user]);


  // Add this line in the useEffect hook right after fetchTranscriptions is called
// Comment out when not needed
  useEffect(() => {
    if (user) {
      injectMockData(supabase);
    }
  }, [user]);
  

  const handleSearch = (query: string) => {
    const filtered = transcriptions.filter(t => 
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTranscriptions(filtered);
  };

  const generateSummary = async (transcription: Transcription) => {
    setSummarizing(prev => ({ ...prev, [transcription.id]: true }));
    try {
      const summary = await generateTranscriptSummary(transcription.content);
      const { error } = await supabase
        .from('transcriptions')
        .update({ summary })
        .eq('id', transcription.id);

      if (error) throw error;

      setTranscriptions(prev => 
        prev.map(t => t.id === transcription.id ? { ...t, summary } : t)
      );
      setFilteredTranscriptions(prev => 
        prev.map(t => t.id === transcription.id ? { ...t, summary } : t)
      );
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTranscriptions.map((transcription, index) => (
              <motion.div
                key={transcription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {transcription.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{transcription.original_filename}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteTranscription(transcription.id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/transcribe/${transcription.id}`}
                      className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
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
                <div className="mt-4 pt-4 border-t space-y-2">
                  {transcription.summary ? (
                    <div className="text-sm text-gray-600">
                      <h4 className="font-semibold mb-2">Summary:</h4>
                      <p className="line-clamp-3">{transcription.summary}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => generateSummary(transcription)}
                      disabled={summarizing[transcription.id]}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {summarizing[transcription.id] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
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
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}