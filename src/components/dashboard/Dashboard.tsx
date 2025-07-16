import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Users,
  MessageSquare,
  BookOpen
} from 'lucide-react'
import { TicketServiceLocal } from '../../services/ticketServiceLocal'
import { useAuth } from '../../hooks/useAuth'
import type { Ticket as TicketType } from '../../types/database'

export function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    openTickets: 0,
    inProgressTickets: 0,
    resolvedToday: 0,
    totalTickets: 0
  })
  const [recentTickets, setRecentTickets] = useState<TicketType[]>([])

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      // Seed sample data on first load
      TicketServiceLocal.seedSampleData(user.id)
      
      // Load stats
      const statsData = await TicketServiceLocal.getStats(user.id)
      setStats(statsData)
      
      // Load recent tickets
      const tickets = await TicketServiceLocal.getTickets(user.id)
      setRecentTickets(tickets.slice(0, 3))
    }

    loadData()
  }, [user])

  const dashboardStats = [
    {
      title: 'Open Tickets',
      value: stats.openTickets.toString(),
      change: '+12%',
      icon: Ticket,
      color: 'text-blue-600'
    },
    {
      title: 'In Progress',
      value: stats.inProgressTickets.toString(),
      change: '-8%',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Resolved Today',
      value: stats.resolvedToday.toString(),
      change: '+24%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Total Tickets',
      value: stats.totalTickets.toString(),
      change: '+2%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ]

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your help desk.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  {' '}from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Latest support requests from customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{ticket.id}</span>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">{ticket.title}</p>
                    <p className="text-xs text-gray-500">
                      {ticket.customer_name} • {formatTimeAgo(ticket.created_at)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Ticket className="h-6 w-6" />
                <span className="text-sm">New Ticket</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Add Customer</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">New Article</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Live Chat</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across your help desk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Sarah Wilson</span> resolved ticket{' '}
                  <span className="font-medium">T-045</span>
                </p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  New ticket <span className="font-medium">T-046</span> created by{' '}
                  <span className="font-medium">Alex Chen</span>
                </p>
                <p className="text-xs text-gray-500">12 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  Knowledge base article <span className="font-medium">"How to reset password"</span> updated
                </p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}