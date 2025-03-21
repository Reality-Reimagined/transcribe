import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
}

export function ApiKeyGenerator() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, created_at, last_used_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to fetch API keys');
    }
  };

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    setLoading(true);
    try {
      // First get or create default organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .single();

      if (orgError && orgError.code !== 'PGRST116') throw orgError;

      let orgId = orgData?.id;

      if (!orgId) {
        const { data: newOrg, error: newOrgError } = await supabase
          .from('organizations')
          .insert({
            name: 'Default Organization',
            created_by: (await supabase.auth.getUser()).data.user?.id
          })
          .select('id')
          .single();

        if (newOrgError) throw newOrgError;
        orgId = newOrg.id;
      }

      // Generate new API key
      const { data, error } = await supabase.rpc('generate_api_key', {
        org_id: orgId,
        name: newKeyName
      });

      if (error) throw error;

      setNewKey(data);
      setNewKeyName('');
      fetchApiKeys();
      toast.success('API key generated successfully');
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApiKeys(prev => prev.filter(key => key.id !== id));
      toast.success('API key deleted');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('API key copied to clipboard');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-6">API Keys</h2>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Enter API key name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
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
      </div>

      {newKey && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-indigo-900 mb-1">New API Key Generated</h3>
              <p className="text-xs text-indigo-700 mb-2">Copy this key now. You won't be able to see it again!</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyApiKey(newKey)}
              className="p-2 text-indigo-700 hover:text-indigo-900"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </motion.button>
          </div>
          <code className="block p-2 bg-white rounded border border-indigo-200 font-mono text-sm">
            {newKey}
          </code>
        </div>
      )}

      <div className="space-y-4">
        {apiKeys.map((key) => (
          <div
            key={key.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{key.name}</h3>
                <p className="text-sm text-gray-500">Created: {formatDate(key.created_at)}</p>
                {key.last_used_at && (
                  <p className="text-sm text-gray-500">
                    Last used: {formatDate(key.last_used_at)}
                  </p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => deleteApiKey(key.id)}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-600">
        API keys are used to authenticate your requests. Keep them secure and never share them publicly.
        You can generate multiple keys and revoke them at any time.
      </p>
    </div>
  );
}