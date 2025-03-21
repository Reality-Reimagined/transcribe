import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FileAudio, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { profile } = useAuth();

  const { data: recentMeetings } = useQuery({
    queryKey: ['recent-meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('organization_id', profile?.organization_id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.organization_id
  });

  const { data: actionItems } = useQuery({
    queryKey: ['action-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('assigned_to', profile?.id)
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || 'User'}
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your meetings
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center space-x-3">
              <FileAudio className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Meetings
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-4">
              {recentMeetings?.length || 0}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Pending Actions
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-4">
              {actionItems?.length || 0}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Completed
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-4">
              {recentMeetings?.filter(m => m.status === 'completed').length || 0}
            </p>
          </motion.div>
        </div>

        {/* Recent meetings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Meetings
            </h2>
            <Link
              to="/meetings"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentMeetings?.map((meeting) => (
              <Link
                key={meeting.id}
                to={`/meetings/${meeting.id}`}
                className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {meeting.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(meeting.meeting_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      meeting.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : meeting.status === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {meeting.status}
                  </span>
                </div>
              </Link>
            ))}

            {(!recentMeetings || recentMeetings.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No recent meetings found
              </div>
            )}
          </div>
        </div>

        {/* Action items */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Pending Action Items
          </h2>

          <div className="space-y-4">
            {actionItems?.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-4 bg-gray-50 rounded-lg p-4"
              >
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  {item.due_date && (
                    <p className="text-sm text-red-600 mt-2">
                      Due: {new Date(item.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {(!actionItems || actionItems.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No pending action items
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}