import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/DashboardLayout';
import { TranscriptionUpload } from '../components/TranscriptionUpload';
import { ProcessingOptions } from '../components/ProcessingOptions';
import { WaveformPlayer } from '../components/WaveformPlayer';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function NewMeeting() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'transcribe' | 'translate' | 'timestamps' | 'words'>('transcribe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !profile?.organization_id) return;

    setIsProcessing(true);
    try {
      // Upload audio file to Supabase Storage
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meeting-audio')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Create meeting record
      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          organization_id: profile.organization_id,
          created_by: profile.id,
          title: title || selectedFile.name,
          description,
          meeting_date: new Date().toISOString(),
          audio_url: uploadData.path,
          status: 'processing',
          type: 'general'
        })
        .select()
        .single();

      if (meetingError) throw meetingError;

      // Start processing (this would typically trigger a serverless function)
      // For now, we'll just simulate processing
      setTimeout(() => {
        toast.success('Meeting uploaded successfully');
        navigate(`/meetings/${meeting.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            New Meeting
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Meeting title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Meeting description"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Upload Audio
              </h2>
              <TranscriptionUpload
                onFileSelect={handleFileSelect}
                onRemove={handleRemoveFile}
                selectedFile={selectedFile}
                isProcessing={isProcessing}
              />
            </div>

            {selectedFile && (
              <>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Preview
                  </h2>
                  <WaveformPlayer
                    audioUrl={URL.createObjectURL(selectedFile)}
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Processing Options
                  </h2>
                  <ProcessingOptions
                    mode={mode}
                    onModeChange={setMode}
                    disabled={isProcessing}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Start Processing'}
                </motion.button>
              </>
            )}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}