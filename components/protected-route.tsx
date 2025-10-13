"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'driver' | 'client'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('ProtectedRoute - loading:', loading, 'user:', user, 'requiredRole:', requiredRole)
    
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to login')
        router.push('/login')
        return
      }

      if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        console.log('User role does not match required role, redirecting to unauthorized')
        router.push('/unauthorized')
        return
      }
      
      console.log('User authenticated and authorized')
    }
  }, [user, loading, router, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return null
  }

  return <>{children}</>
}
