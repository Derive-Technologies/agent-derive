'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Shield, Zap, Workflow } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          router.push('/dashboard')
        }
      })
      .catch(() => {
        // User not logged in, stay on login page
      })
  }, [router])

  const handleLogin = () => {
    // Redirect to Auth0 login
    window.location.href = '/api/auth/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agent Derive</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Intelligent Workflow Automation Platform</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your workflows and automation dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign in with Auth0
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                  Secure Authentication
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Fast & Reliable</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Workflow className="h-4 w-4 text-blue-500" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Bot className="h-4 w-4 text-purple-500" />
                <span>Smart Automation</span>
              </div>
            </div>

            {/* Footer Text */}
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>

        {/* Demo Account Info */}
        <Card className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
              🔐 Demo Account Available
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Contact your administrator for demo credentials or use your organization's Auth0 account to sign in.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}