# Sticker MOM Admin Setup Guide

## 🚀 Quick Setup

### Option 1: Automated Setup (Requires Service Role Key)
If you have a Supabase service role key:

```bash
# Add service role key to .env
echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key" >> .env

# Run automated setup
node setup-admin.js
```

### Option 2: Manual Setup (Always Works)
For manual setup without service role permissions:

```bash
# Get setup instructions
node setup-admin-manual.js
```

## 📋 Manual Setup Steps

### 1. Environment Variables
Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Create Admin Table
Run this SQL in your Supabase SQL editor:

```sql
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
```

### 3. Create Admin User
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Fill in:
   - **Email**: `admin@sticker.mom`
   - **Password**: Choose a secure password
   - **Auto confirm user**: ✅ Checked
4. Click "Add user"
5. **Copy the User ID** from the new user

### 4. Link User to Admin Table
Run this SQL in Supabase SQL editor (replace `YOUR_USER_ID_HERE`):

```sql
INSERT INTO admins (user_id, email)
VALUES ('YOUR_USER_ID_HERE', 'admin@sticker.mom');
```

### 5. Test Admin Login
```bash
npm run dev
```
Navigate to `http://localhost:5173/admin` and log in with your admin credentials.

## 🔒 Security Features

- **Role-based Access**: Only users in the `admins` table can access admin panel
- **Row Level Security**: Users can only see their own admin records
- **Protected Routes**: Double-check authentication + admin privileges
- **Session Management**: Automatic session handling with Supabase Auth

## 🛠 Troubleshooting

### "User not allowed" Error
- You need a service role key for automated user creation
- Use manual setup instead (Option 2)

### "Table doesn't exist" Error
- Run the admin table creation SQL manually
- Check Supabase permissions

### Blank White Page
- Check browser console for errors
- Verify environment variables are set
- Ensure admin user is properly added to admins table

### Login Issues
- Verify user exists in Supabase Auth
- Check if user ID is in the admins table
- Ensure email confirmation is enabled

## 📁 Files Created

- `src/components/admin/ProtectedRoute.tsx` - Admin table check
- `src/AdminApp.tsx` - Error boundary added
- `src/components/admin/layout/DashboardLayout.tsx` - Logout button
- `supabase-admin-setup.sql` - Admin table schema
- `setup-admin.js` - Automated setup (requires service role)
- `setup-admin-manual.js` - Manual setup instructions

## 🎯 Next Steps

1. **Test CRUD Operations**: Create, read, update, delete products
2. **Add More Features**: Orders management, analytics, etc.
3. **Deploy**: Set up production environment
4. **Security Audit**: Review and enhance security measures

## 🔑 Service Role Key (Optional)

For automated setup, add this to your `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get it from: Supabase Dashboard → Settings → API → service_role key

**⚠️ WARNING**: Keep service role key secret - never commit to git!

Happy coding! 🎉