import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { TicketList } from './components/tickets/TicketList'
import { KnowledgeBase } from './components/knowledge-base/KnowledgeBase'
import { Analytics } from './components/analytics/Analytics'
import { NotificationCenter } from './components/notifications/NotificationCenter'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Loader2, LogIn } from 'lucide-react'

function App() {
  const { user, isLoading, isAuthenticated, login } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading your help desk...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="h-10 w-10 rounded bg-primary flex items-center justify-center">
                  <span className="text-white font-bold">HD</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">HelpDesk Pro</h1>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome to Your Help Desk
                </h2>
                <p className="text-gray-600">
                  Manage tickets, track performance, and deliver exceptional customer support.
                </p>
              </div>

              <div className="space-y-4">
                <Button onClick={login} className="w-full" size="lg">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In to Continue
                </Button>
                <p className="text-xs text-gray-500">
                  Secure authentication powered by Blink
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-xs text-gray-600">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-xs text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'tickets':
        return <TicketList />
      case 'knowledge-base':
        return <KnowledgeBase />
      case 'analytics':
        return <Analytics />
      case 'notifications':
        return <NotificationCenter />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App