import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  Bell, 
  Check, 
  X, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Settings
} from 'lucide-react'
import { blink } from '../../blink/client'

interface Notification {
  id: string
  type: 'ticket_created' | 'ticket_assigned' | 'ticket_resolved' | 'mention' | 'system'
  title: string
  message: string
  isRead: boolean
  relatedTicketId?: string
  createdAt: string
  user?: {
    name: string
    avatar?: string
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'ticket_created',
      title: 'New Ticket Created',
      message: 'John Doe created ticket T-156: "Login issues with mobile app"',
      isRead: false,
      relatedTicketId: 'T-156',
      createdAt: '2024-01-15T10:30:00Z',
      user: { name: 'John Doe', avatar: '' }
    },
    {
      id: 'n2',
      type: 'ticket_assigned',
      title: 'Ticket Assigned',
      message: 'You have been assigned to ticket T-155: "Payment processing error"',
      isRead: false,
      relatedTicketId: 'T-155',
      createdAt: '2024-01-15T09:45:00Z'
    },
    {
      id: 'n3',
      type: 'ticket_resolved',
      title: 'Ticket Resolved',
      message: 'Sarah Wilson resolved ticket T-154: "Data export functionality"',
      isRead: true,
      relatedTicketId: 'T-154',
      createdAt: '2024-01-15T08:20:00Z',
      user: { name: 'Sarah Wilson', avatar: '' }
    },
    {
      id: 'n4',
      type: 'mention',
      title: 'You were mentioned',
      message: 'Mike Johnson mentioned you in ticket T-153 comments',
      isRead: true,
      relatedTicketId: 'T-153',
      createdAt: '2024-01-14T16:15:00Z',
      user: { name: 'Mike Johnson', avatar: '' }
    },
    {
      id: 'n5',
      type: 'system',
      title: 'System Update',
      message: 'Help desk system will undergo maintenance tonight at 2 AM EST',
      isRead: false,
      createdAt: '2024-01-14T14:30:00Z'
    }
  ])

  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Set up real-time notifications
    const setupRealtime = async () => {
      try {
        const unsubscribe = await blink.realtime.subscribe('notifications', (message) => {
          if (message.type === 'notification') {
            const newNotification: Notification = {
              id: message.id,
              type: message.data.type,
              title: message.data.title,
              message: message.data.message,
              isRead: false,
              relatedTicketId: message.data.relatedTicketId,
              createdAt: new Date().toISOString(),
              user: message.data.user
            }
            
            setNotifications(prev => [newNotification, ...prev])
            
            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
              new Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/favicon.svg'
              })
            }
          }
        })
        
        setIsConnected(true)
        return unsubscribe
      } catch (error) {
        console.error('Failed to setup real-time notifications:', error)
        setIsConnected(false)
      }
    }

    setupRealtime()

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ticket_created':
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      case 'ticket_assigned':
        return <Clock className="h-4 w-4 text-orange-600" />
      case 'ticket_resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'mention':
        return <Bell className="h-4 w-4 text-purple-600" />
      case 'system':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-gray-600">Stay updated with real-time alerts</p>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )}
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => {
                    const today = new Date().toDateString()
                    return new Date(n.createdAt).toDateString() === today
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    notification.isRead 
                      ? 'bg-white border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  {notification.user && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback className="text-xs">
                        {notification.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <Badge className="bg-blue-100 text-blue-800">New</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatTime(notification.createdAt)}</span>
                      {notification.relatedTicketId && (
                        <Badge variant="outline" className="text-xs">
                          {notification.relatedTicketId}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}