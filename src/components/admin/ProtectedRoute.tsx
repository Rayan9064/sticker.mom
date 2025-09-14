import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { Session } from '@supabase/supabase-js'
import { AdminLogin } from './AdminLogin'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId)
      
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userId)
        .single()

      console.log('Admin query result:', { data, error })

      if (error) {
        console.log('Admin check error:', error.message)
        if (error.code === 'PGRST116') {
          console.log('User not found in admins table')
        }
        return false
      }

      console.log('User is admin:', !!data)
      return !!data
    } catch (error) {
      console.error('Admin check failed:', error)
      return false
    }
  }

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }

        console.log('Initial session found:', !!session, session?.user?.email)
        setSession(session)

        if (session?.user?.id) {
          console.log('Session exists, checking admin status...')
          const adminStatus = await checkAdminStatus(session.user.id)
          if (mounted) {
            setIsAdmin(adminStatus)
          }
        } else {
          console.log('No session found')
          if (mounted) {
            setIsAdmin(false)
          }
        }

        if (mounted) {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log('Auth event:', event, 'Session exists:', !!session, session?.user?.email)
      
      setSession(session)

      if (event === 'SIGNED_OUT') {
        console.log('User signed out')
        setIsAdmin(false)
        setLoading(false)
        return
      }

      if (session?.user?.id) {
        console.log('Auth change with session, checking admin...')
        setLoading(true)
        const adminStatus = await checkAdminStatus(session.user.id)
        if (mounted) {
          setIsAdmin(adminStatus)
          setLoading(false)
        }
      } else {
        console.log('Auth change with no session')
        if (mounted) {
          setIsAdmin(false)
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      console.log('Signing out...')
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        setLoading(false)
      }
      // Auth state change will handle the rest
    } catch (error) {
      console.error('Sign out error:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
          <div className="mt-4">
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Having trouble? Sign out
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return <AdminLogin />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have admin privileges to access this page.
          </p>
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}