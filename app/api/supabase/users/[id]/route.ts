import { type NextRequest, NextResponse } from "next/server"
import { supabaseService } from "@/lib/supabase"

/**
 * SUPABASE DELETE OPERATION - SQL Database
 *
 * This demonstrates how to delete records from a SQL database
 */

// DELETE /api/supabase/users/[id] - Delete a user from SQL database
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    console.log("Deleting user from Supabase:", id)

    // Delete user from SQL database
    // This translates to: DELETE FROM users WHERE id = ?
    await supabaseService.delete("users", id)

    console.log("User deleted from Supabase successfully")

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      database: "supabase",
      type: "SQL",
    })
  } catch (error) {
    console.error("Supabase DELETE error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete user from Supabase",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
