import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // This is only for development purposes
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 })
  }

  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // In a real app, you would never do this - this is just for development
    // This simulates confirming a user's email
    const { error } = await supabase.auth.admin.updateUserById(userId, { email_confirm: true })

    if (error) {
      console.error("Error confirming user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in confirm-user route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
