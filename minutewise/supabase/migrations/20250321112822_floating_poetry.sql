/*
  # Initial MinuteWise Schema Setup

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to Supabase auth.users
      - Includes organization and role information
    
    - `organizations`
      - Stores company/organization information
      - Manages team structure and settings
    
    - `meetings`
      - Stores meeting metadata and transcriptions
      - Links to organizations and users
      - Includes processing status and summary
    
    - `meeting_participants`
      - Tracks meeting attendees and their roles
      - Links users to meetings
    
    - `action_items`
      - Stores tasks and follow-ups from meetings
      - Links to meetings and assignees

  2. Security
    - Enable RLS on all tables
    - Set up policies for organization-based access
    - Implement role-based permissions
*/

-- Organizations table
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  settings jsonb DEFAULT '{}'::jsonb,
  subscription_tier text DEFAULT 'free',
  subscription_status text DEFAULT 'active',
  CONSTRAINT valid_subscription_tier CHECK (subscription_tier IN ('free', 'professional', 'enterprise')),
  CONSTRAINT valid_subscription_status CHECK (subscription_status IN ('active', 'past_due', 'canceled'))
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations ON DELETE SET NULL,
  full_name text,
  role text DEFAULT 'member',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  settings jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_role CHECK (role IN ('admin', 'member'))
);

-- Meetings table
CREATE TABLE meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  meeting_date timestamptz NOT NULL,
  duration interval,
  status text DEFAULT 'pending',
  type text DEFAULT 'general',
  audio_url text,
  transcript text,
  summary text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  CONSTRAINT valid_type CHECK (type IN ('general', 'client', 'board', 'team'))
);

-- Meeting participants
CREATE TABLE meeting_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  role text DEFAULT 'attendee',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_participant_role CHECK (role IN ('host', 'attendee', 'guest'))
);

-- Action items
CREATE TABLE action_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings ON DELETE CASCADE,
  assigned_to uuid REFERENCES profiles ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed', 'canceled'))
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;

-- Organization policies
CREATE POLICY "Users can view their organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

-- Profile policies
CREATE POLICY "Users can view profiles in their organization"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Meeting policies
CREATE POLICY "Users can view meetings in their organization"
  ON meetings
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create meetings in their organization"
  ON meetings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Meeting participants policies
CREATE POLICY "Users can view meeting participants"
  ON meeting_participants
  FOR SELECT
  TO authenticated
  USING (
    meeting_id IN (
      SELECT id FROM meetings WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Action items policies
CREATE POLICY "Users can view action items in their organization"
  ON action_items
  FOR SELECT
  TO authenticated
  USING (
    meeting_id IN (
      SELECT id FROM meetings WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_profiles_organization ON profiles(organization_id);
CREATE INDEX idx_meetings_organization ON meetings(organization_id);
CREATE INDEX idx_meetings_created_by ON meetings(created_by);
CREATE INDEX idx_meeting_participants_meeting ON meeting_participants(meeting_id);
CREATE INDEX idx_action_items_meeting ON action_items(meeting_id);
CREATE INDEX idx_action_items_assigned_to ON action_items(assigned_to);