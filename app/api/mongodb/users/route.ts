import { type NextRequest, NextResponse } from "next/server"
import { mongoService } from "@/lib/mongodb"

/**
 * MONGODB API ROUTES - NoSQL Database Operations
 *
 * This file demonstrates how to create API endpoints for NoSQL database operations
 * using MongoDB
 */

// GET /api/mongodb/users - Fetch all users from NoSQL database
export async function GET() {
  try {
    console.log("Fetching users from MongoDB (NoSQL)...")

    // Use our MongoDB service to get all users
    // This uses MongoDB's find() method to get all documents
    const users = await mongoService.findAll("users")

    console.log(`Found ${users?.length || 0} users in MongoDB`)

    return NextResponse.json({
      success: true,
      users: users || [],
      database: "mongodb",
      type: "NoSQL",
    })
  } catch (error) {
    console.error("MongoDB GET error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users from MongoDB",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST /api/mongodb/users - Create a new user in NoSQL database
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name, email, age } = body

    // Validate required fields (we do this in code, not database schema)
    if (!name || !email || !age) {
      return NextResponse.json({ success: false, error: "Name, email, and age are required" }, { status: 400 })
    }

    console.log("Creating user in MongoDB:", { name, email, age })

    // Insert user into NoSQL database
    // MongoDB stores this as a document (similar to JSON)
    const newUser = await mongoService.insertOne("users", {
      name,
      email,
      age: Number.parseInt(age),
      // We could add additional fields here without changing the schema
      // metadata: { source: 'web', version: '1.0' }
    })

    console.log("User created in MongoDB:", newUser)

    return NextResponse.json({
      success: true,
      user: newUser,
      database: "mongodb",
      type: "NoSQL",
    })
  } catch (error) {
    console.error("MongoDB POST error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user in MongoDB",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

/**
 * NOSQL DATABASE CHARACTERISTICS DEMONSTRATED:
 *
 * 1. Flexible Schema: Documents can have different fields
 * 2. Document Storage: Data stored as JSON-like documents
 * 3. No Joins: Related data is typically embedded in documents
 * 4. Dynamic Fields: Can add new fields without schema changes
 * 5. Horizontal Scaling: Designed to scale across multiple servers
 */
