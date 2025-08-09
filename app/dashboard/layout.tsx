'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { Container } from '@/components/layout/container'
import ErrorBoundary from '@/components/error-boundary'
import { Toaster } from 'sonner'
import { toast } from 'sonner'

// Fallback user data
const fallbackUser = {
  name: 'Guest User',
  email: 'guest@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
  role: 'User',
  tenant: 'Demo'
}

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    title: 'New workflow created',
    message: 'Purchase Approval workflow is now active',
    type: 'success' as const,
    read: false,
    timestamp: new Date()
  },
  {
    id: '2',
    title: 'Approval required',
    message: 'You have 3 pending approvals',
    type: 'info' as const,
    read: false,
    timestamp: new Date()
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentUser, setCurrentUser] = useState(fallbackUser)
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    // Fetch user data from our API
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser({
            name: data.user.name || data.user.email || 'User',
            email: data.user.email || 'no-email@example.com',
            avatar: data.user.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
            role: data.user.role || 'User',
            tenant: data.user.tenantName || 'Organization'
          })
        }
      })
      .catch(err => console.error('Failed to fetch user:', err))
  }, [])
  const handleUserMenuAction = (action: 'profile' | 'settings' | 'logout') => {
    switch (action) {
      case 'profile':
        toast.info('Profile page coming soon!')
        break
      case 'settings':
        window.location.href = '/dashboard/settings'
        break
      case 'logout':
        // Redirect to Auth0 logout
        window.location.href = '/api/auth/logout'
        break
    }
  }

  const handleNotificationClick = (notification: any) => {
    toast.info(`Notification: ${notification.title}`)
  }

  const handleCreateWorkflow = () => {
    router.push('/dashboard/workflows/new')
  }

  const handleSearch = (query: string) => {
    toast.info(`Searching for: ${query}`)
  }

  const handleNavigate = (item: any) => {
    if (item.id === 'create') {
      router.push('/dashboard/workflows/new')
    } else if (item.href) {
      // Map the navigation items to the correct routes
      const route = item.href.startsWith('/dashboard') ? item.href : `/dashboard${item.href}`
      router.push(route)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={currentUser}
        notifications={mockNotifications}
        onUserMenuAction={handleUserMenuAction}
        onNotificationClick={handleNotificationClick}
        onCreateWorkflow={handleCreateWorkflow}
        onSearch={handleSearch}
      />
      <div className="flex">
        <Sidebar onNavigate={handleNavigate} />
        <main className="flex-1 overflow-hidden">
          <Container className="py-6">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </Container>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}