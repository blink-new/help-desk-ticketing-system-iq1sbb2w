import { blink } from '../blink/client'

export class DatabaseSetup {
  static async initializeTables() {
    try {
      // Create tickets table
      await blink.db.sql(`
        CREATE TABLE IF NOT EXISTS tickets (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
          priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
          category TEXT NOT NULL,
          customer_name TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          assigned_agent_id TEXT,
          assigned_agent_name TEXT,
          user_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          message_count INTEGER DEFAULT 0
        )
      `)

      // Create ticket_messages table
      await blink.db.sql(`
        CREATE TABLE IF NOT EXISTS ticket_messages (
          id TEXT PRIMARY KEY,
          ticket_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          author_name TEXT NOT NULL,
          author_email TEXT NOT NULL,
          message TEXT NOT NULL,
          is_internal BOOLEAN DEFAULT FALSE,
          created_at TEXT NOT NULL,
          FOREIGN KEY (ticket_id) REFERENCES tickets(id)
        )
      `)

      // Create customers table
      await blink.db.sql(`
        CREATE TABLE IF NOT EXISTS customers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          company TEXT,
          phone TEXT,
          user_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `)

      // Create agents table
      await blink.db.sql(`
        CREATE TABLE IF NOT EXISTS agents (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('agent', 'admin')),
          user_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `)

      console.log('Database tables initialized successfully')
      return true
    } catch (error) {
      console.error('Failed to initialize database tables:', error)
      return false
    }
  }

  static async seedSampleData(userId: string) {
    try {
      // Check if data already exists
      const existingTickets = await blink.db.tickets.list({ 
        where: { user_id: userId },
        limit: 1 
      })
      
      if (existingTickets.length > 0) return // Don't seed if data exists

      // Create sample tickets
      const sampleTickets = [
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
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
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
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
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
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          message_count: 1
        }
      ]

      // Insert sample tickets
      for (const ticket of sampleTickets) {
        await blink.db.tickets.create(ticket)
      }

      console.log('Sample data seeded successfully')
      return true
    } catch (error) {
      console.error('Failed to seed sample data:', error)
      return false
    }
  }
}