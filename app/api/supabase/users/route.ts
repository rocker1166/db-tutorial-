import { type NextRequest, NextResponse } from "next/server"
import { supabaseService } from "@/lib/supabase"

/**
 * SUPABASE API ROUTES - SQL Database Operations
 *
 * This file demonstrates how to create API endpoints for SQL database operations
 * using Supabase (PostgreSQL)
 */

// GET /api/supabase/users - Fetch all users from SQL database
export async function GET() {
  try {
    console.log("Fetching users from Supabase (SQL)...")

    // Use our Supabase service to get all users
    // This translates to: SELECT * FROM users ORDER BY created_at DESC
    const users = await supabaseService.getAll("users")

    console.log(`Found ${users?.length || 0} users in Supabase`)

    return NextResponse.json({
      success: true,
      users: users || [],
      database: "supabase",
      type: "SQL",
    })
  } catch (error) {
    console.error("Supabase GET error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users from Supabase",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST /api/supabase/users - Create a new user in SQL database
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name, email, age } = body

    // Validate required fields
    if (!name || !email || !age) {
      return NextResponse.json({ success: false, error: "Name, email, and age are required" }, { status: 400 })
    }

    console.log("Creating user in Supabase:", { name, email, age })

    // Insert user into SQL database
    // This translates to: INSERT INTO users (name, email, age) VALUES (...)
    const newUser = await supabaseService.insert("users", {
      name,
      email,
      age: Number.parseInt(age),
    })

    console.log("User created in Supabase:", newUser)

    return NextResponse.json({
      success: true,
      user: newUser[0],
      database: "supabase",
      type: "SQL",
    })
  } catch (error) {
    console.error("Supabase POST error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user in Supabase",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

/**
 * SQL DATABASE CHARACTERISTICS DEMONSTRATED:
 *
 * 1. Structured Data: All users must have the same fields (name, email, age)
 * 2. Data Types: Age must be an integer, enforced by the database schema
 * 3. ACID Compliance: Operations are atomic, consistent, isolated, and durable
 * 4. Relationships: Can easily JOIN with other tables if needed
 * 5. Schema Validation: Database enforces the structure automatically
 */
