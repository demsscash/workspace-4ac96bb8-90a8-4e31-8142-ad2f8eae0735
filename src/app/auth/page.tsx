'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'

export default function AuthPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </AuthProvider>
  )
}