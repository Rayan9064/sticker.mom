-- Create admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view their own record" ON admins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can update their own record" ON admins
  FOR UPDATE USING (auth.uid() = user_id);

-- Temporary policy for debugging (remove after fixing)
CREATE POLICY "Allow authenticated users to view admins for debugging" ON admins
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert admins for setup" ON admins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admins WHERE admins.user_id = $1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial admin (replace with actual user ID after creating user)
-- INSERT INTO admins (user_id, email) VALUES ('user-uuid-here', 'admin@stickermom.com');