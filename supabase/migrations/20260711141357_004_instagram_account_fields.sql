/*
# Instagram Business Integration - Account Fields

## Overview
Extends the instagram_integration table with account profile fields and sync metadata
to support real Instagram Graph API integration.

## Changes

### Modified Table: `instagram_integration`
New columns:
- `account_name` (varchar 255) — Instagram display name
- `username` (varchar 255) — Instagram @username
- `profile_pic_url` (text) — Profile picture URL
- `followers_count` (integer) — Follower count
- `media_count` (integer) — Total media/posts count
- `last_post_date` (date) — Date of last publication
- `last_sync_at` (timestamptz) — Last synchronization timestamp
- `sync_error` (text) — Last sync error message if any

### Security
- RLS already enabled, policies already in place from previous migration
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instagram_integration' AND column_name = 'account_name'
  ) THEN
    ALTER TABLE instagram_integration ADD COLUMN account_name varchar(255);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instagram_integration' AND column_name = 'username'
  ) THEN
    ALTER TABLE instagram_integration ADD COLUMN username varchar(255);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instagram_integration' AND column_name = 'profile_pic_url'
  ) THEN
    ALTER TABLE instagram_integration ADD COLUMN profile_pic_url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instagram_integration' AND column_name = 'followers_count'
  ) THEN
    ALTER TABLE instagram_integration ADD COLUMN followers_count integer NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instagram_integration' AND column_name = 'media_count'
  ) THEN
    ALTER TABLE instagram_integration ADD COLUMN media_count integer NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instagram_integration' AND column_name = 'last_post_date'
  ) THEN
    ALTER TABLE instagram_integration ADD COLUMN last_post_date date;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instagram_integration' AND column_name = 'last_sync_at'
  ) THEN
    ALTER TABLE instagram_integration ADD COLUMN last_sync_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instagram_integration' AND column_name = 'sync_error'
  ) THEN
    ALTER TABLE instagram_integration ADD COLUMN sync_error text;
  END IF;
END $$;
