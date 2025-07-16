import { blink } from '../blink/client'
import type { Ticket, TicketMessage } from '../types/database'
import { DatabaseSetup } from './databaseSetup'

export class TicketService {
  static async createTicket(ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at' | 'message_count'>, userId: string) {
    // Ensure database is initialized
    await DatabaseSetup.initializeTables()
    
    const ticketId = 'T-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    
    const ticket = await blink.db.tickets.create({
      id: ticketId,
      ...ticketData,
      user_id: userId,
      message_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    
    return ticket
  }

  static async getTickets(userId: string, filters?: { status?: string; priority?: string; search?: string }) {
    // Ensure database is initialized
    await DatabaseSetup.initializeTables()
    
    let whereClause: any = { user_id: userId }
    
    if (filters?.status && filters.status !== 'all') {
      whereClause.status = filters.status
    }
    
    if (filters?.priority && filters.priority !== 'all') {
      whereClause.priority = filters.priority
    }
    
    const tickets = await blink.db.tickets.list({
      where: whereClause,
      orderBy: { created_at: 'desc' }
    })
    
    // Filter by search query on frontend since we can't do complex text search in SQL easily
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      return tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.customer_name.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower)
      )
    }
    
    return tickets
  }

  static async getTicketById(id: string) {
    return await blink.db.tickets.list({
      where: { id },
      limit: 1
    }).then(tickets => tickets[0] || null)
  }

  static async updateTicket(id: string, userId: string, updates: Partial<Ticket>) {
    await DatabaseSetup.initializeTables()
    
    return await blink.db.tickets.update(id, {
      ...updates,
      updated_at: new Date().toISOString()
    })
  }

  static async deleteTicket(id: string) {
    return await blink.db.tickets.delete(id)
  }

  static async addMessage(ticketId: string, message: string, isInternal = false) {
    const user = await blink.auth.me()
    
    // Add the message
    const ticketMessage = await blink.db.ticket_messages.create({
      ticket_id: ticketId,
      user_id: user.id,
      author_name: user.displayName || user.email,
      author_email: user.email,
      message,
      is_internal: isInternal,
      created_at: new Date().toISOString()
    })
    
    // Update message count on ticket
    const ticket = await this.getTicketById(ticketId)
    if (ticket) {
      await this.updateTicket(ticketId, {
        message_count: (ticket.message_count || 0) + 1
      })
    }
    
    return ticketMessage
  }

  static async getTicketMessages(ticketId: string) {
    return await blink.db.ticket_messages.list({
      where: { ticket_id: ticketId },
      orderBy: { created_at: 'asc' }
    })
  }

  static async getStats(userId: string) {
    await DatabaseSetup.initializeTables()
    
    const tickets = await blink.db.tickets.list({
      where: { user_id: userId }
    })
    
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

  static async seedSampleData(userId: string) {
    return await DatabaseSetup.seedSampleData(userId)
  }
}