import type { Ticket, TicketMessage } from '../types/database'

// Simple local storage service as fallback when database is not available
export class LocalStorageService {
  private static getKey(table: string, userId: string) {
    return `helpdesk_${table}_${userId}`
  }

  static saveTickets(userId: string, tickets: Ticket[]) {
    localStorage.setItem(this.getKey('tickets', userId), JSON.stringify(tickets))
  }

  static getTickets(userId: string): Ticket[] {
    const data = localStorage.getItem(this.getKey('tickets', userId))
    return data ? JSON.parse(data) : []
  }

  static saveMessages(userId: string, messages: TicketMessage[]) {
    localStorage.setItem(this.getKey('messages', userId), JSON.stringify(messages))
  }

  static getMessages(userId: string): TicketMessage[] {
    const data = localStorage.getItem(this.getKey('messages', userId))
    return data ? JSON.parse(data) : []
  }

  static generateId(): string {
    return 'T-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  }
}