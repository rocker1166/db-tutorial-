import { createClient } from "@supabase/supabase-js"

/**
 * SUPABASE CONNECTION SETUP
 *
 * This file demonstrates how to connect to a SQL database (PostgreSQL via Supabase)
 *
 * Key concepts:
 * 1. Client Initialization - Create a connection to the database
 * 2. Environment Variables - Store sensitive credentials securely
 * 3. Singleton Pattern - Reuse the same client instance
 */

// Environment variables for Supabase connection
// These should be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create and export the Supabase client
// This is our "database connection" for SQL operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * SUPABASE CLIENT EXPLANATION:
 *
 * The createClient function establishes a connection to your Supabase PostgreSQL database.
 * It handles:
 * - Authentication
 * - Connection pooling
 * - Real-time subscriptions
 * - Automatic retries
 *
 * This client can be used throughout your application to:
 * - Query data: supabase.from('table').select()
 * - Insert data: supabase.from('table').insert()
 * - Update data: supabase.from('table').update()
 * - Delete data: supabase.from('table').delete()
 */

// Example of a reusable database service class
export class SupabaseService {
  private client = supabase

  // Generic method to get all records from a table
  async getAll(tableName: string) {
    const { data, error } = await this.client.from(tableName).select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Generic method to insert a record
  async insert(tableName: string, data: any) {
    const { data: result, error } = await this.client.from(tableName).insert(data).select()

    if (error) throw error
    return result
  }

  // Generic method to delete a record
  async delete(tableName: string, id: string) {
    const { error } = await this.client.from(tableName).delete().eq("id", id)

    if (error) throw error
  }
}

export const supabaseService = new SupabaseService()
