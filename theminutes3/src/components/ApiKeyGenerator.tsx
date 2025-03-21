import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function ApiKeyGenerator() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateApiKey = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('generate_api_key');
      if (error) throw error;
      setApiKey(data);
      setShowApiKey(true);
      toast.success('API key generated successfully');
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('API key copied to clipboard');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">API Key</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateApiKey}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Generate New Key
        </motion.button>
      </div>

      {apiKey && (
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <code className="font-mono text-sm">
            {showApiKey ? apiKey : '•'.repeat(40)}
          </code>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-gray-600 hover:text-indigo-600 px-2 py-1"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyApiKey}
              className="p-2 text-gray-600 hover:text-indigo-600"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-600">
        Use this key to authenticate your API requests. Keep it secure and never share it publicly.
      </p>
    </div>
  );
}