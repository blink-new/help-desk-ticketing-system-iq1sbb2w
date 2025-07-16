import { LocalStorageService } from './localStorageService'
import type { Ticket, TicketMessage } from '../types/database'

export class TicketServiceLocal {
  static async createTicket(ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at' | 'message_count'>, userId: string) {
    const tickets = LocalStorageService.getTickets(userId)
    
    const newTicket: Ticket = {
      ...ticketData,
      id: LocalStorageService.generateId(),
      user_id: userId,
      message_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    tickets.push(newTicket)
    LocalStorageService.saveTickets(userId, tickets)
    
    return newTicket
  }

  static async getTickets(userId: string, filters?: { status?: string; priority?: string; search?: string }) {
    let tickets = LocalStorageService.getTickets(userId)
    
    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      tickets = tickets.filter(t => t.status === filters.status)
    }
    
    if (filters?.priority && filters.priority !== 'all') {
      tickets = tickets.filter(t => t.priority === filters.priority)
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      tickets = tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.customer_name.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower)
      )
    }
    
    // Sort by created_at desc
    return tickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  static async getTicketById(id: string, userId: string) {
    const tickets = LocalStorageService.getTickets(userId)
    return tickets.find(t => t.id === id) || null
  }

  static async updateTicket(id: string, userId: string, updates: Partial<Ticket>) {
    const tickets = LocalStorageService.getTickets(userId)
    const index = tickets.findIndex(t => t.id === id)
    
    if (index !== -1) {
      tickets[index] = {
        ...tickets[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      LocalStorageService.saveTickets(userId, tickets)
      return tickets[index]
    }
    
    return null
  }

  static async deleteTicket(id: string, userId: string) {
    const tickets = LocalStorageService.getTickets(userId)
    const filteredTickets = tickets.filter(t => t.id !== id)
    LocalStorageService.saveTickets(userId, filteredTickets)
    return true
  }

  static async addMessage(ticketId: string, userId: string, message: string, authorName: string, authorEmail: string, isInternal = false) {
    const messages = LocalStorageService.getMessages(userId)
    
    const newMessage: TicketMessage = {
      id: 'msg-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ticket_id: ticketId,
      user_id: userId,
      author_name: authorName,
      author_email: authorEmail,
      message,
      is_internal: isInternal,
      created_at: new Date().toISOString()
    }
    
    messages.push(newMessage)
    LocalStorageService.saveMessages(userId, messages)
    
    // Update message count on ticket
    const tickets = LocalStorageService.getTickets(userId)
    const ticketIndex = tickets.findIndex(t => t.id === ticketId)
    if (ticketIndex !== -1) {
      tickets[ticketIndex].message_count = (tickets[ticketIndex].message_count || 0) + 1
      tickets[ticketIndex].updated_at = new Date().toISOString()
      LocalStorageService.saveTickets(userId, tickets)
    }
    
    return newMessage
  }

  static async getTicketMessages(ticketId: string, userId: string) {
    const messages = LocalStorageService.getMessages(userId)
    return messages
      .filter(m => m.ticket_id === ticketId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  static async getStats(userId: string) {
    const tickets = LocalStorageService.getTickets(userId)
    
    const openTickets = tickets.filter(t => t.status === 'open').length
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length
    const resolvedToday = tickets.filter(t => {
      const today = new Date().toDateString()
      const ticketDate = new Date(t.updated_at).toDateString()
      return t.status === 'resolved' && ticketDate === today
    }).length
    
    return {
      openTickets,
      inProgressTickets,
      resolvedToday,
      totalTickets: tickets.length
    }
  }

  static seedSampleData(userId: string) {
    const existingTickets = LocalStorageService.getTickets(userId)
    if (existingTickets.length > 0) return // Don't seed if data already exists
    
    const sampleTickets: Ticket[] = [
      {
        id: 'T-001',
        title: 'Login issues with mobile app',
        description: 'Users are experiencing difficulties logging into the mobile application. The error occurs after entering credentials.',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        assigned_agent_name: 'Sarah Wilson',
        priority: 'high',
        status: 'open',
        category: 'Technical',
        user_id: userId,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
        message_count: 3
      },
      {
        id: 'T-002',
        title: 'Payment processing error',
        description: 'Customer unable to complete payment for subscription renewal. Card is being declined despite sufficient funds.',
        customer_name: 'Jane Smith',
        customer_email: 'jane@example.com',
        assigned_agent_name: 'Mike Johnson',
        priority: 'urgent',
        status: 'in_progress',
        category: 'Billing',
        user_id: userId,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
        message_count: 7
      },
      {
        id: 'T-003',
        title: 'Feature request: Dark mode',
        description: 'Multiple users have requested a dark mode option for the dashboard to reduce eye strain during night usage.',
        customer_name: 'Alex Chen',
        customer_email: 'alex@example.com',
        priority: 'low',
        status: 'open',
        category: 'Feature Request',
        user_id: userId,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        message_count: 1
      }
    ]
    
    LocalStorageService.saveTickets(userId, sampleTickets)
  }
}