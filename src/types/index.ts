export interface User {
  id: string
  tenantId: string
  email: string
  name: string
  avatarUrl?: string
  role: 'admin' | 'agent' | 'customer'
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  id: string
  name: string
  domain?: string
  customDomain?: string
  logoUrl?: string
  primaryColor: string
  accentColor: string
  subscriptionPlan: 'starter' | 'pro' | 'enterprise'
  subscriptionStatus: 'active' | 'inactive' | 'cancelled'
  maxAgents: number
  maxTicketsPerMonth: number
  createdAt: string
  updatedAt: string
}

export interface Ticket {
  id: string
  tenantId: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category?: string
  customerId: string
  assignedAgentId?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  customer?: User
  assignedAgent?: User
}

export interface TicketMessage {
  id: string
  ticketId: string
  userId: string
  message: string
  isInternal: boolean
  attachments?: string[]
  createdAt: string
  user?: User
}

export interface KBArticle {
  id: string
  tenantId: string
  title: string
  content: string
  category?: string
  tags: string[]
  isPublished: boolean
  authorId: string
  viewCount: number
  helpfulCount: number
  createdAt: string
  updatedAt: string
  author?: User
}

export interface Notification {
  id: string
  tenantId: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  relatedTicketId?: string
  createdAt: string
}

export interface AnalyticsEvent {
  id: string
  tenantId: string
  eventType: string
  eventData?: any
  userId?: string
  createdAt: string
}