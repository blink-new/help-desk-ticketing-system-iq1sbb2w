import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  Calendar,
  Download,
  Filter
} from 'lucide-react'

export function Analytics() {
  const timeRanges = ['7d', '30d', '90d', '1y']
  
  const metrics = [
    {
      title: 'Total Tickets',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: MessageSquare,
      description: 'vs last period'
    },
    {
      title: 'Resolution Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      description: 'tickets resolved'
    },
    {
      title: 'Avg Response Time',
      value: '2.4h',
      change: '-18.3%',
      trend: 'up',
      icon: Clock,
      description: 'first response'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: TrendingUp,
      description: 'average rating'
    }
  ]

  const ticketsByStatus = [
    { status: 'Open', count: 45, percentage: 18, color: 'bg-blue-500' },
    { status: 'In Progress', count: 32, percentage: 13, color: 'bg-yellow-500' },
    { status: 'Resolved', count: 156, percentage: 62, color: 'bg-green-500' },
    { status: 'Closed', count: 18, percentage: 7, color: 'bg-gray-500' }
  ]

  const ticketsByPriority = [
    { priority: 'Urgent', count: 8, percentage: 3, color: 'bg-red-500' },
    { priority: 'High', count: 34, percentage: 14, color: 'bg-orange-500' },
    { priority: 'Medium', count: 142, percentage: 56, color: 'bg-yellow-500' },
    { priority: 'Low', count: 67, percentage: 27, color: 'bg-green-500' }
  ]

  const topAgents = [
    { name: 'Sarah Wilson', tickets: 89, satisfaction: 4.9, responseTime: '1.2h' },
    { name: 'Mike Johnson', tickets: 76, satisfaction: 4.8, responseTime: '1.8h' },
    { name: 'Emily Davis', tickets: 65, satisfaction: 4.7, responseTime: '2.1h' },
    { name: 'Alex Chen', tickets: 54, satisfaction: 4.6, responseTime: '2.4h' },
    { name: 'John Smith', tickets: 43, satisfaction: 4.5, responseTime: '2.8h' }
  ]

  const recentActivity = [
    { time: '2 min ago', event: 'Ticket T-156 resolved by Sarah Wilson', type: 'resolved' },
    { time: '5 min ago', event: 'New ticket T-157 created by customer', type: 'created' },
    { time: '12 min ago', event: 'Ticket T-145 escalated to high priority', type: 'escalated' },
    { time: '18 min ago', event: 'Knowledge base article updated', type: 'updated' },
    { time: '25 min ago', event: 'Customer satisfaction survey completed', type: 'survey' }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'created': return <MessageSquare className="h-4 w-4 text-blue-600" />
      case 'escalated': return <TrendingUp className="h-4 w-4 text-orange-600" />
      case 'updated': return <Calendar className="h-4 w-4 text-purple-600" />
      case 'survey': return <Users className="h-4 w-4 text-indigo-600" />
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track performance and insights across your help desk</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {metric.change}
                  </span>
                  <span>{metric.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Status</CardTitle>
            <CardDescription>Distribution of ticket statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticketsByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tickets by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
            <CardDescription>Priority distribution of active tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticketsByPriority.map((item) => (
                <div key={item.priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.priority}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Agents */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Agents</CardTitle>
            <CardDescription>Agent performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAgents.map((agent, index) => (
                <div key={agent.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{agent.name}</p>
                      <p className="text-xs text-gray-500">{agent.tickets} tickets resolved</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{agent.satisfaction}</span>
                      <Badge variant="outline" className="text-xs">
                        {agent.responseTime}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.event}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Ticket volume and resolution trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chart Coming Soon</h3>
              <p className="text-gray-500">Interactive charts will be available in the next update</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}