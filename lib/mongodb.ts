import { MongoClient, type Db, type Collection } from "mongodb"

/**
 * MONGODB CONNECTION SETUP
 *
 * This file demonstrates how to connect to a NoSQL database (MongoDB)
 *
 * Key concepts:
 * 1. Client Initialization - Create a connection to the database
 * 2. Connection Pooling - Reuse connections efficiently
 * 3. Database and Collection Selection - Navigate the document structure
 */

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI!
const MONGODB_DB = process.env.MONGODB_DB || "tutorial_db"

// Global variable to cache the MongoDB client
// This implements the singleton pattern for connection reuse
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

/**
 * Connect to MongoDB with connection caching
 * This pattern is important in serverless environments like Vercel
 * to avoid creating multiple connections
 */
export async function connectToMongoDB(): Promise<{ client: MongoClient; db: Db }> {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Create new MongoDB client with connection options
  const client = new MongoClient(MONGODB_URI, {
    // Connection pool settings for optimal performance
    maxPoolSize: 10, // Maximum number of connections in the pool
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server
    socketTimeoutMS: 45000, // How long to wait for a response
  })

  try {
    // Connect to MongoDB
    await client.connect()

    // Select the database
    const db = client.db(MONGODB_DB)

    // Cache the connection for reuse
    cachedClient = client
    cachedDb = db

    console.log("Connected to MongoDB successfully")
    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

/**
 * MONGODB SERVICE CLASS
 *
 * This class provides a clean interface for MongoDB operations
 * Similar to how we created a service for Supabase
 */
export class MongoDBService {
  private db: Db | null = null

  // Initialize the database connection
  async init() {
    if (!this.db) {
      const { db } = await connectToMongoDB()
      this.db = db
    }
    return this.db
  }

  // Get a collection (similar to a table in SQL)
  async getCollection(collectionName: string): Promise<Collection> {
    const db = await this.init()
    return db.collection(collectionName)
  }

  // Generic method to find all documents in a collection
  async findAll(collectionName: string) {
    const collection = await this.getCollection(collectionName)
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  // Generic method to insert a document
  async insertOne(collectionName: string, document: any) {
    const collection = await this.getCollection(collectionName)

    // Add timestamp to document (common pattern in NoSQL)
    const documentWithTimestamp = {
      ...document,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await collection.insertOne(documentWithTimestamp)

    // Return the inserted document with its new _id
    return await collection.findOne({ _id: result.insertedId })
  }

  // Generic method to delete a document
  async deleteOne(collectionName: string, id: string) {
    const collection = await this.getCollection(collectionName)
    const { ObjectId } = require("mongodb")

    return await collection.deleteOne({ _id: new ObjectId(id) })
  }

  // Generic method to update a document
  async updateOne(collectionName: string, id: string, update: any) {
    const collection = await this.getCollection(collectionName)
    const { ObjectId } = require("mongodb")

    const updateWithTimestamp = {
      ...update,
      updatedAt: new Date().toISOString(),
    }

    return await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateWithTimestamp })
  }
}

// Export a singleton instance
export const mongoService = new MongoDBService()

/**
 * KEY DIFFERENCES FROM SQL:
 *
 * 1. No predefined schema - documents can have different fields
 * 2. Collections instead of tables
 * 3. Documents instead of rows
 * 4. ObjectId instead of auto-incrementing integers
 * 5. Embedded documents instead of JOINs
 * 6. Flexible data types within the same field across documents
 */
