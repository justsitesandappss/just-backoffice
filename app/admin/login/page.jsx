"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || "Connexion impossible")
        setLoading(false)
        return
      }

      router.push("/admin")
      router.refresh()
    } catch {
      setError("Erreur réseau")
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "radial-gradient(circle at top, rgba(200,164,78,0.14), transparent 28%), #0a0a0f",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(18,18,26,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: 32,
          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          color: "#e8e8f0",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(200,164,78,0.12)",
              color: "#c8a44e",
              fontSize: 24,
              marginBottom: 18,
            }}
          >
            🔐
          </div>

          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 28,
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            Accès Admin
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#9a9ab0",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Entre ton mot de passe pour ouvrir le backoffice.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="admin-password"
            style={{
              display: "block",
              marginBottom: 8,
              color: "#b8b8c8",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Mot de passe
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError("")
            }}
            placeholder="Entre ton mot de passe"
            autoFocus
            style={{
              width: "100%",
              height: 48,
              padding: "0 14px",
              boxSizing: "border-box",
              borderRadius: 12,
              border: error
                ? "1px solid rgba(229,69,96,0.75)"
                : "1px solid rgba(255,255,255,0.08)",
              background: "#101018",
              color: "#fff",
              outline: "none",
              fontSize: 14,
            }}
          />

          {error ? (
            <p
              style={{
                margin: "10px 0 0",
                color: "#e54560",
                fontSize: 13,
              }}
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 48,
              marginTop: 18,
              border: "none",
              borderRadius: 12,
              background: "#c8a44e",
              color: "#0a0a0f",
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Connexion..." : "Entrer dans le backoffice"}
          </button>
        </form>
      </div>
    </div>
  )
}