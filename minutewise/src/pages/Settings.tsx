import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SettingsForm {
  full_name: string;
  email: string;
  organization_name: string;
  notification_preferences: {
    email_notifications: boolean;
    meeting_reminders: boolean;
    action_item_updates: boolean;
  };
}

export function Settings() {
  const { user, profile } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>({
    defaultValues: {
      full_name: profile?.full_name || '',
      email: user?.email || '',
      organization_name: profile?.organization?.name || '',
      notification_preferences: {
        email_notifications: true,
        meeting_reminders: true,
        action_item_updates: true,
      },
    },
  });

  const onSubmit = async (data: SettingsForm) => {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          settings: {
            notification_preferences: data.notification_preferences,
          },
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      if (profile?.organization_id) {
        const { error: orgError } = await supabase
          .from('organizations')
          .update({
            name: data.organization_name,
          })
          .eq('id', profile.organization_id);

        if (orgError) throw orgError;
      }

      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
              
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  {...register('full_name', { required: 'Full name is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>
            </div>

            {/* Organization Settings */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Organization</h2>
              
              <div>
                <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="organization_name"
                  {...register('organization_name', { required: 'Organization name is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.organization_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.organization_name.message}</p>
                )}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email_notifications"
                    {...register('notification_preferences.email_notifications')}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="email_notifications" className="ml-3 block text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="meeting_reminders"
                    {...register('notification_preferences.meeting_reminders')}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="meeting_reminders" className="ml-3 block text-sm font-medium text-gray-700">
                    Meeting Reminders
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="action_item_updates"
                    {...register('notification_preferences.action_item_updates')}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="action_item_updates" className="ml-3 block text-sm font-medium text-gray-700">
                    Action Item Updates
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </motion.button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
          <p className="mt-1 text-sm text-gray-500">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Account
          </motion.button>
        </div>
      </div>
    </DashboardLayout>
  );
}