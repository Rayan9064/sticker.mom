#!/usr/bin/env node

/**
 * Admin Setup Script for Sticker MOM
 *
 * This script helps you set up the admin table in Supabase
 * and add your first admin user.
 *
 * Usage:
 * 1. Make sure you have your Supabase credentials in .env
 * 2. Run: node setup-admin.js
 * 3. Follow the prompts to create your admin user
 */

import { createClient } from '@supabase/supabase-js'
import { createInterface } from 'readline'
import { config } from 'dotenv'

// Load environment variables
config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please make sure you have:')
  console.log('- VITE_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY (preferred) or VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

async function createAdminTable() {
  console.log('🔧 Creating admin table...')

  try {
    // Try to create the table using SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create admins table
        CREATE TABLE IF NOT EXISTS admins (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

        -- Create policies
        DROP POLICY IF EXISTS "Admins can view their own record" ON admins;
        CREATE POLICY "Admins can view their own record" ON admins
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Admins can update their own record" ON admins;
        CREATE POLICY "Admins can update their own record" ON admins
          FOR UPDATE USING (auth.uid() = user_id);
      `
    })

    if (error) {
      console.log('⚠️  RPC method not available, trying direct table creation...')
      // If RPC doesn't work, we'll provide manual instructions
      console.log('📋 Please run this SQL manually in your Supabase SQL editor:')
      console.log(`
-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
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
      `)
      return false
    }

    console.log('✅ Admin table created successfully')
    return true
  } catch (error) {
    console.log('⚠️  Could not create table automatically')
    console.log('📋 Please run this SQL manually in your Supabase SQL editor:')
    console.log(`
-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
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
    `)
    return false
  }
}

async function createAdminUser(email, password) {
  console.log('👤 Creating admin user...')

  // Check if we have service role key
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️  No service role key found. Please create the admin user manually:')
    console.log('\n📋 Manual Setup Instructions:')
    console.log('1. Go to Supabase Dashboard → Authentication → Users')
    console.log('2. Click "Add user"')
    console.log(`3. Email: ${email}`)
    console.log(`4. Password: ${password}`)
    console.log('5. Check "Auto confirm user"')
    console.log('6. Click "Add user"')
    console.log('7. Copy the User ID from the new user')
    console.log('8. Run this SQL in Supabase SQL editor:')
    console.log(`   INSERT INTO admins (user_id, email) VALUES ('YOUR_USER_ID_HERE', '${email}');`)
    console.log('\nAfter completing these steps, you can log in to the admin panel.')
    return { id: 'manual-setup-required', email }
  }

  try {
    // Create the user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (userError) {
      console.error('❌ Error creating user:', userError.message)
      console.log('\n📋 Please create the admin user manually instead:')
      console.log('1. Go to Supabase Dashboard → Authentication → Users')
      console.log('2. Click "Add user"')
      console.log(`3. Email: ${email}`)
      console.log(`4. Password: ${password}`)
      console.log('5. Check "Auto confirm user"')
      console.log('6. Click "Add user"')
      return null
    }

    console.log('✅ User created successfully')

    // Add to admins table
    const { error: adminError } = await supabase
      .from('admins')
      .insert({
        user_id: userData.user.id,
        email: email
      })

    if (adminError) {
      console.error('❌ Error adding user to admins table:', adminError.message)
      console.log('⚠️  User created but not added to admins table')
      console.log('📋 Please manually add this user to the admins table:')
      console.log(`INSERT INTO admins (user_id, email) VALUES ('${userData.user.id}', '${email}');`)
      return userData.user
    }

    console.log('✅ User added to admins table')
    return userData.user
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    return null
  }
}

async function main() {
  console.log('🚀 Sticker MOM Admin Setup')
  console.log('==========================\n')

  // Check if admin table exists
  try {
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'admins')

    if (error) {
      console.log('⚠️  Could not check if admin table exists')
    } else if (tables && tables.length > 0) {
      console.log('ℹ️  Admin table already exists')
    } else {
      const success = await createAdminTable()
      if (!success) {
        console.log('⚠️  Please create the admin table manually first')
      }
    }
  } catch (error) {
    console.log('⚠️  Could not check admin table status')
  }

  // Get admin credentials
  const email = await ask('Enter admin email: ')
  const password = await ask('Enter admin password (min 6 characters): ')

  if (password.length < 6) {
    console.log('❌ Password must be at least 6 characters long')
    rl.close()
    return
  }

  // Create admin user
  const user = await createAdminUser(email, password)

  if (user) {
    if (user.id === 'manual-setup-required') {
      console.log('\n🎉 Setup instructions provided above!')
      console.log('Complete the manual steps, then you can log in to the admin panel at /admin')
    } else {
      console.log('\n🎉 Admin setup complete!')
      console.log('📧 Email:', email)
      console.log('🔑 User ID:', user.id)
      console.log('\nYou can now log in to the admin panel at /admin')
    }
  } else {
    console.log('❌ Failed to create admin user')
    console.log('Please try the manual setup instructions above.')
  }

  rl.close()
}

main().catch(console.error)