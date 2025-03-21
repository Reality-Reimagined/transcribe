import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileAudio, Plus, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';

interface Transcription {
  id: string;
  title: string;
  original_filename: string;
  created_at: string;
  duration: number;
  language: string;
}

export function Dashboard() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error('Error fetching transcriptions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTranscriptions();
  }, [user]);

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
        <h1 className="text-3xl font-bold text-gray-900">Your Transcriptions</h1>
        <Link
          to="/transcribe"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
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
        <div className="text-center py-12">
          <FileAudio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transcriptions yet</h3>
          <p className="text-gray-500 mb-4">Start by creating your first transcription</p>
          <Link
            to="/transcribe"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Transcription</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transcriptions.map((transcription, index) => (
            <motion.div
              key={transcription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {transcription.title}
                  </h3>
                  <p className="text-sm text-gray-500">{transcription.original_filename}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(transcription.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(transcription.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="capitalize">{transcription.language}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}