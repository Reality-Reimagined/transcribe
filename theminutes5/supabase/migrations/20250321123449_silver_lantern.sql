/*
  # Initial Schema Setup for Verbatim

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
      - `created_by` (uuid, references profiles)
    
    - `transcriptions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `original_filename` (text)
      - `content` (text)
      - `duration` (float)
      - `language` (text)
      - `segments` (jsonb)
      - `words` (jsonb)
      - `org_id` (uuid, references organizations)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create organizations table
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) NOT NULL
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read organizations they belong to"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Create transcriptions table
CREATE TABLE transcriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  original_filename text NOT NULL,
  content text NOT NULL,
  duration float,
  language text,
  segments jsonb,
  words jsonb,
  org_id uuid REFERENCES organizations(id) NOT NULL,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read transcriptions from their organizations"
  ON transcriptions
  FOR SELECT
  TO authenticated
  USING (
    org_id IN (
      SELECT id FROM organizations WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create transcriptions in their organizations"
  ON transcriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id IN (
      SELECT id FROM organizations WHERE created_by = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transcriptions_updated_at
  BEFORE UPDATE ON transcriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();