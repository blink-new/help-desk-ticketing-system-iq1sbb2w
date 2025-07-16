import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  User,
  Calendar,
  MessageSquare
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export function TicketList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const tickets = [
    {
      id: 'T-001',
      title: 'Login issues with mobile app',
      description: 'Users are experiencing difficulties logging into the mobile application...',
      customer: { name: 'John Doe', email: 'john@example.com', avatar: '' },
      assignedAgent: { name: 'Sarah Wilson', email: 'sarah@company.com', avatar: '' },
      priority: 'high',
      status: 'open',
      category: 'Technical',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      messageCount: 3
    },
    {
      id: 'T-002',
      title: 'Payment processing error',
      description: 'Customer unable to complete payment for subscription renewal...',
      customer: { name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
      assignedAgent: { name: 'Mike Johnson', email: 'mike@company.com', avatar: '' },
      priority: 'urgent',
      status: 'in_progress',
      category: 'Billing',
      createdAt: '2024-01-15T08:15:00Z',
      updatedAt: '2024-01-15T15:45:00Z',
      messageCount: 7
    },
    {
      id: 'T-003',
      title: 'Feature request: Dark mode',
      description: 'Multiple users have requested a dark mode option for the dashboard...',
      customer: { name: 'Alex Chen', email: 'alex@example.com', avatar: '' },
      assignedAgent: null,
      priority: 'low',
      status: 'open',
      category: 'Feature Request',
      createdAt: '2024-01-14T16:20:00Z',
      updatedAt: '2024-01-14T16:20:00Z',
      messageCount: 1
    },
    {
      id: 'T-004',
      title: 'Data export functionality not working',
      description: 'The CSV export feature is returning empty files...',
      customer: { name: 'Emily Davis', email: 'emily@example.com', avatar: '' },
      assignedAgent: { name: 'Sarah Wilson', email: 'sarah@company.com', avatar: '' },
      priority: 'medium',
      status: 'resolved',
      category: 'Technical',
      createdAt: '2024-01-13T11:00:00Z',
      updatedAt: '2024-01-15T09:30:00Z',
      messageCount: 5
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600">Manage and track customer support requests</p>
        </div>
        <Button>Create Ticket</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-mono text-sm font-medium text-gray-600">
                      {ticket.id}
                    </span>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-500">{ticket.category}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {ticket.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {ticket.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{ticket.customer.name}</span>
                    </div>
                    
                    {ticket.assignedAgent && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={ticket.assignedAgent.avatar} />
                          <AvatarFallback className="text-xs">
                            {ticket.assignedAgent.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{ticket.assignedAgent.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{ticket.messageCount} messages</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Updated {formatDate(ticket.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Assign Agent</DropdownMenuItem>
                    <DropdownMenuItem>Change Priority</DropdownMenuItem>
                    <DropdownMenuItem>Close Ticket</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first ticket to get started'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}