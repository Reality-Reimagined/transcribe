import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, RefreshCw, Webhook, Copy, Check, Plus } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
}

export function Connections() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuthStore();

  const integrations: Integration[] = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      icon: '/integrations/salesforce.svg',
      description: 'Automatically create notes in Salesforce from your transcriptions',
      connected: false
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      icon: '/integrations/hubspot.svg',
      description: 'Sync transcriptions with HubSpot CRM',
      connected: false
    },
    {
      id: 'zendesk',
      name: 'Zendesk',
      icon: '/integrations/zendesk.svg',
      description: 'Create tickets and notes in Zendesk',
      connected: false
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: '/integrations/slack.svg',
      description: 'Share transcriptions directly to Slack channels',
      connected: false
    }
  ];

  const generateApiKey = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_api_key');
      if (error) throw error;
      setApiKey(data);
      setShowApiKey(true);
      toast.success('API key generated successfully');
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
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

  const connectIntegration = (integration: Integration) => {
    toast.success(`Redirecting to ${integration.name} authorization...`);
    // Implementation for OAuth flow would go here
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connections</h1>
        <p className="text-gray-600">Manage your API keys and integrate with your favorite tools</p>
      </div>

      {/* API Key Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold">API Key</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateApiKey}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
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
                className="text-gray-600 hover:text-indigo-600"
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

        <div className="mt-4 text-sm text-gray-600">
          Use this key to authenticate your API requests. Keep it secure and never share it publicly.
        </div>
      </div>

      {/* Integrations Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Webhook className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Integrations</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <motion.div
              key={integration.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <img
                      src={integration.icon}
                      alt={integration.name}
                      className="w-8 h-8"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => connectIntegration(integration)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    integration.connected
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {integration.connected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Connected
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Connect
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}