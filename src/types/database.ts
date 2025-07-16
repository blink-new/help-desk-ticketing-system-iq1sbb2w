export interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  customer_name: string
  customer_email: string
  assigned_agent_id?: string
  assigned_agent_name?: string
  user_id: string
  created_at: string
  updated_at: string
  message_count: number
}

export interface TicketMessage {
  id: string
  ticket_id: string
  user_id: string
  author_name: string
  author_email: string
  message: string
  is_internal: boolean
  created_at: string
}

export interface Customer {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  name: string
  email: string
  role: 'agent' | 'admin'
  user_id: string
  created_at: string
  updated_at: string
}