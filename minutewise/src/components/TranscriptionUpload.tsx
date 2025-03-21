import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, FileAudio } from 'lucide-react';
import toast from 'react-hot-toast';

interface TranscriptionUploadProps {
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

export function TranscriptionUpload({
  onFileSelect,
  onRemove,
  selectedFile,
  isProcessing
}: TranscriptionUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('File size must be less than 100MB');
        return;
      }
      if (!file.type.startsWith('audio/')) {
        toast.error('Please upload an audio file');
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'audio/*': []
    },
    maxFiles: 1,
    disabled: isProcessing,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false),
  });

  return (
    <div className="w-full">
      {selectedFile ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg border-2 border-indigo-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileAudio className="w-6 h-6 text-indigo-600" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isProcessing && (
              <button
                onClick={onRemove}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-indigo-400 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload
            className={`w-12 h-12 mx-auto mb-4 ${
              isDragging ? 'text-indigo-600' : 'text-gray-400'
            }`}
          />
          <p className="text-lg font-medium text-gray-900">
            Drop your audio file here
          </p>
          <p className="mt-1 text-sm text-gray-500">
            or click to select a file
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Supports MP3, WAV, M4A • Max file size 100MB
          </p>
        </div>
      )}
    </div>
  );
}