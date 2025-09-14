#!/usr/bin/env node

/**
 * Admin Setup Helper for Sticker MOM
 *
 * This script provides manual setup instructions for creating an admin user
 * since automated setup requires service role permissions.
 */

console.log('🚀 Sticker MOM Admin Setup Helper')
console.log('=================================\n')

console.log('📋 MANUAL SETUP INSTRUCTIONS:')
console.log('==============================\n')

console.log('1. 🗄️  CREATE ADMIN TABLE')
console.log('   Run this SQL in your Supabase SQL editor:\n')

console.log(`   -- Create admins table
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
     FOR UPDATE USING (auth.uid() = user_id);\n`)

console.log('2. 👤 CREATE ADMIN USER')
console.log('   Go to Supabase Dashboard → Authentication → Users')
console.log('   Click "Add user"')
console.log('   Fill in:')
console.log('   - Email: admin@sticker.mom (or your preferred admin email)')
console.log('   - Password: Choose a secure password')
console.log('   - Check "Auto confirm user"')
console.log('   - Click "Add user"')
console.log('   - Copy the User ID from the new user\n')

console.log('3. 🔗 LINK USER TO ADMIN TABLE')
console.log('   Run this SQL in Supabase SQL editor (replace USER_ID_HERE):')
console.log('   INSERT INTO admins (user_id, email) VALUES')
console.log('   (\'USER_ID_HERE\', \'admin@sticker.mom\');\n')

console.log('4. 🧪 TEST ADMIN LOGIN')
console.log('   Start your app: npm run dev')
console.log('   Navigate to: http://localhost:5173/admin')
console.log('   Log in with your admin credentials\n')

console.log('✅ SETUP COMPLETE!')
console.log('==================')
console.log('Your admin panel is now secured with role-based access control.')
console.log('Only users in the admins table can access the admin dashboard.\n')

console.log('🔒 SECURITY FEATURES:')
console.log('- Row Level Security (RLS) enabled')
console.log('- Users can only see their own admin records')
console.log('- Protected routes with double authentication')
console.log('- Automatic session management\n')

console.log('📚 NEXT STEPS:')
console.log('- Test CRUD operations for products')
console.log('- Add more admin features as needed')
console.log('- Consider adding more granular permissions\n')

console.log('🎉 Happy coding!')