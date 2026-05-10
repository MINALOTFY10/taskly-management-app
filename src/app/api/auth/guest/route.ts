import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient()

    const email = process.env.GUEST_LOGIN_EMAIL
    const password = process.env.GUEST_LOGIN_PASSWORD

    if (!email || !password) {
      return NextResponse.json(
        { error: "Guest credentials not configured on the server." },
        { status: 500 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message ?? "Guest login failed." }, { status: 400 })
    }

    return NextResponse.json({ data, error: null })
  } catch (err) {
    return NextResponse.json({ error: "Network error. Please try again." }, { status: 500 })
  }
}
