-- SUPABASE TABLE CREATION SCRIPT
-- This SQL script creates the necessary tables for our tutorial

-- Enable Row Level Security (RLS) - Supabase best practice
-- RLS ensures data security by controlling who can access what data

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  -- Primary key with auto-increment (UUID is also common in Supabase)
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  
  -- User information fields
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE, -- Ensure email uniqueness
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150), -- Data validation
  
  -- Timestamps for tracking record creation and updates
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Enable Row Level Security on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public read access
-- In production, you'd want more restrictive policies
CREATE POLICY "Public can read users" ON users
  FOR SELECT TO anon, authenticated
  USING (true);

-- Create a policy that allows public insert access
-- In production, you'd want authentication required
CREATE POLICY "Public can insert users" ON users
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Create a policy that allows public delete access
-- In production, you'd want proper authorization
CREATE POLICY "Public can delete users" ON users
  FOR DELETE TO anon, authenticated
  USING (true);

-- Insert some sample data for testing
INSERT INTO users (name, email, age) VALUES
  ('John Doe', 'john.doe@example.com', 30),
  ('Jane Smith', 'jane.smith@example.com', 25),
  ('Bob Johnson', 'bob.johnson@example.com', 35),
  ('Alice Brown', 'alice.brown@example.com', 28)
ON CONFLICT (email) DO NOTHING; -- Avoid duplicate entries if script runs multiple times

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at on row updates
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- SQL DATABASE CONCEPTS DEMONSTRATED:
-- 1. DDL (Data Definition Language): CREATE TABLE, ALTER TABLE
-- 2. DML (Data Manipulation Language): INSERT
-- 3. Constraints: PRIMARY KEY, NOT NULL, UNIQUE, CHECK
-- 4. Indexes: For performance optimization
-- 5. Triggers: For automatic timestamp updates
-- 6. Functions: Reusable database logic
-- 7. Row Level Security: Supabase security feature
-- 8. Policies: Fine-grained access control

-- PRODUCTION CONSIDERATIONS:
-- 1. Use more restrictive RLS policies
-- 2. Implement proper authentication
-- 3. Add more comprehensive data validation
-- 4. Consider partitioning for large datasets
-- 5. Set up proper backup and recovery procedures
-- 6. Monitor query performance and optimize indexes
