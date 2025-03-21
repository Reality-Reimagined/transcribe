import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, FileDown, File as FilePdf } from 'lucide-react';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';

interface DownloadOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  fileName: string;
  mode: 'transcribe' | 'translate' | 'timestamps' | 'words';
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

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

export function DownloadOptions({ isOpen, onClose, content, fileName, mode, segments, words }: DownloadOptionsProps) {
  const getFormattedContent = () => {
    if (mode === 'timestamps' && segments) {
      return segments.map(segment => (
        `[${formatTime(segment.start)} - ${formatTime(segment.end)}]\n${segment.text}\n\n`
      )).join('');
    } else if (mode === 'words' && words) {
      return words.map(word => (
        `[${formatTime(word.start)}] ${word.word}\n`
      )).join('');
    }
    return content;
  };

  const getMarkdownContent = () => {
    if (mode === 'timestamps' && segments) {
      return segments.map(segment => (
        `### ${formatTime(segment.start)} - ${formatTime(segment.end)}\n${segment.text}\n\n`
      )).join('');
    } else if (mode === 'words' && words) {
      return words.map(word => (
        `**[${formatTime(word.start)}]** ${word.word}  \n`
      )).join('');
    }
    return content;
  };

  const downloadTxt = () => {
    const formattedContent = getFormattedContent();
    const blob = new Blob([formattedContent], { type: 'text/plain' });
    downloadFile(blob, `${fileName}.txt`);
  };

  const downloadMarkdown = () => {
    const markdownContent = getMarkdownContent();
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    downloadFile(blob, `${fileName}.md`);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Add title
    doc.setFontSize(16);
    doc.setTextColor(63, 70, 229); // Indigo color
    doc.text(mode.charAt(0).toUpperCase() + mode.slice(1), margin, yPosition);
    yPosition += 10;

    // Add content based on mode
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    if (mode === 'timestamps' && segments) {
      segments.forEach(segment => {
        // Add timestamp
        doc.setFont(undefined, 'bold');
        const timestamp = `${formatTime(segment.start)} - ${formatTime(segment.end)}`;
        doc.setTextColor(79, 70, 229); // Indigo color
        doc.text(timestamp, margin, yPosition);
        yPosition += 7;

        // Add text
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        const textLines = doc.splitTextToSize(segment.text, pageWidth - 2 * margin);
        textLines.forEach((line: string) => {
          if (yPosition > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(line, margin, yPosition);
          yPosition += 7;
        });
        yPosition += 5;
      });
    } else if (mode === 'words' && words) {
      words.forEach(word => {
        if (yPosition > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.setFont(undefined, 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text(`[${formatTime(word.start)}]`, margin, yPosition);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(word.word, margin + 35, yPosition);
        yPosition += 7;
      });
    } else {
      const textLines = doc.splitTextToSize(content, pageWidth - 2 * margin);
      textLines.forEach((line: string) => {
        if (yPosition > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });
    }

    doc.save(`${fileName}.pdf`);
  };

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Download Options</h3>
            <div className="space-y-3">
              <button
                onClick={downloadTxt}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Text File (.txt)</span>
              </button>
              <button
                onClick={downloadMarkdown}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileDown className="w-5 h-5 text-purple-600" />
                <span>Markdown (.md)</span>
              </button>
              <button
                onClick={downloadPdf}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FilePdf className="w-5 h-5 text-pink-600" />
                <span>PDF Document (.pdf)</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}