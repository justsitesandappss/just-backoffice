import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 })
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set({
      name: "just_admin_session",
      value: process.env.ADMIN_SESSION_TOKEN,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    })

    return response
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 })
  }
}