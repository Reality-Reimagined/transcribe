/*
  # Initial Schema Setup for The Minutes

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
      - `created_by` (uuid, references auth.users)
    
    - `transcriptions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `original_filename` (text)
      - `content` (text)
      - `duration` (float)
      - `language` (text)
      - `segments` (jsonb)
      - `words` (jsonb)
      - `summary` (text)
      - `org_id` (uuid, references organizations)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `api_keys`
      - `id` (uuid, primary key)
      - `key` (text, encrypted)
      - `name` (text)
      - `org_id` (uuid, references organizations)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `last_used_at` (timestamp)
      - `expires_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Secure API key handling
*/

-- Enable pgcrypto for API key encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles can be read by the owner
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Profiles can be updated by the owner
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Create organizations table
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Organizations can be read by members
CREATE POLICY "Users can read own organizations"
    ON public.organizations
    FOR SELECT
    USING (created_by = auth.uid());

-- Organizations can be created by authenticated users
CREATE POLICY "Users can create organizations"
    ON public.organizations
    FOR INSERT
    WITH CHECK (created_by = auth.uid());

-- Create transcriptions table
CREATE TABLE public.transcriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    original_filename text NOT NULL,
    content text NOT NULL,
    duration float,
    language text,
    segments jsonb,
    words jsonb,
    summary text,
    org_id uuid REFERENCES public.organizations NOT NULL,
    created_by uuid REFERENCES auth.users NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;

-- Transcriptions can be read by organization members
CREATE POLICY "Users can read transcriptions from their organizations"
    ON public.transcriptions
    FOR SELECT
    USING (
        org_id IN (
            SELECT id FROM public.organizations WHERE created_by = auth.uid()
        )
    );

-- Transcriptions can be created by organization members
CREATE POLICY "Users can create transcriptions in their organizations"
    ON public.transcriptions
    FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT id FROM public.organizations WHERE created_by = auth.uid()
        )
    );

-- Create API keys table
CREATE TABLE public.api_keys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text NOT NULL,
    name text NOT NULL,
    org_id uuid REFERENCES public.organizations NOT NULL,
    created_by uuid REFERENCES auth.users NOT NULL,
    created_at timestamptz DEFAULT now(),
    last_used_at timestamptz,
    expires_at timestamptz
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- API keys can be read by organization members
CREATE POLICY "Users can read API keys from their organizations"
    ON public.api_keys
    FOR SELECT
    USING (
        org_id IN (
            SELECT id FROM public.organizations WHERE created_by = auth.uid()
        )
    );

-- API keys can be created by organization members
CREATE POLICY "Users can create API keys in their organizations"
    ON public.api_keys
    FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT id FROM public.organizations WHERE created_by = auth.uid()
        )
    );

-- Function to generate a secure API key
CREATE OR REPLACE FUNCTION generate_api_key(org_id uuid, name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_key text;
    encrypted_key text;
BEGIN
    -- Generate a random API key
    new_key := encode(gen_random_bytes(32), 'hex');
    
    -- Encrypt the key before storing
    encrypted_key := crypt(new_key, gen_salt('bf'));
    
    -- Insert the encrypted key
    INSERT INTO public.api_keys (key, name, org_id, created_by)
    VALUES (encrypted_key, name, org_id, auth.uid());
    
    -- Return the unencrypted key (will only be shown once)
    RETURN new_key;
END;
$$;

-- Function to validate an API key
CREATE OR REPLACE FUNCTION validate_api_key(api_key text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    key_record record;
BEGIN
    -- Find the API key record
    SELECT * INTO key_record
    FROM public.api_keys
    WHERE key = crypt(api_key, key)
    AND (expires_at IS NULL OR expires_at > now());
    
    -- If key is found, update last_used_at and return org_id
    IF FOUND THEN
        UPDATE public.api_keys
        SET last_used_at = now()
        WHERE id = key_record.id;
        
        RETURN key_record.org_id;
    END IF;
    
    RETURN NULL;
END;
$$;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transcriptions_updated_at
    BEFORE UPDATE ON public.transcriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ language 'plpgsql' security definer;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();