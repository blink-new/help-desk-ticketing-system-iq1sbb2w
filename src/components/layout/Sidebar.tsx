import { 
  LayoutDashboard, 
  Ticket, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  MessageSquare,
  Bell
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets', label: 'Tickets', icon: Ticket, badge: '12' },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="w-64 bg-gray-50 border-r h-full flex flex-col">
      <div className="p-4">
        <Button className="w-full" onClick={() => onTabChange('create-ticket')}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="mr-3 h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant={isActive ? 'secondary' : 'default'} className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Need Help?</p>
            <p className="text-xs text-blue-700">Contact support</p>
          </div>
        </div>
      </div>
    </div>
  )
}