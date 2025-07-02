import { type NextRequest, NextResponse } from "next/server"
import { mongoService } from "@/lib/mongodb"

/**
 * MONGODB DELETE OPERATION - NoSQL Database
 *
 * This demonstrates how to delete documents from a NoSQL database
 */

// DELETE /api/mongodb/users/[id] - Delete a user from NoSQL database
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    console.log("Deleting user from MongoDB:", id)

    // Delete user from NoSQL database
    // MongoDB uses ObjectId for document identification
    const result = await mongoService.deleteOne("users", id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    console.log("User deleted from MongoDB successfully")

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      database: "mongodb",
      type: "NoSQL",
    })
  } catch (error) {
    console.error("MongoDB DELETE error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete user from MongoDB",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
