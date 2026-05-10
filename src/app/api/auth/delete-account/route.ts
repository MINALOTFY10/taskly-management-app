import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ error: "Delete account not implemented on server. Please contact support." }, { status: 501 })
}
