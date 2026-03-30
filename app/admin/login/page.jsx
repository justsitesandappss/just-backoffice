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
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(212,175,55,0.10), transparent 26%), #000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          width: "100%",
          maxWidth: "460px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.24)",
              marginBottom: "16px",
            }}
          >
            Just Agency
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(46px, 9vw, 72px)",
              lineHeight: 0.95,
              letterSpacing: "-3px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            JUST
          </h1>

          <div
            style={{
              width: "72px",
              height: "1px",
              background: "rgba(255,255,255,0.10)",
              margin: "18px auto 0",
            }}
          />
        </div>

        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0.006))",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "28px",
            padding: "30px 28px",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.03)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.18)",
              color: "#F5E6A2",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            🔐
          </div>

          <div
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.24)",
              marginBottom: "8px",
            }}
          >
            Console privée
          </div>

          <h2
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "34px",
              lineHeight: 1,
              letterSpacing: "-1px",
              fontWeight: 700,
            }}
          >
            Accès Admin
          </h2>

          <p
            style={{
              margin: "14px 0 0",
              color: "rgba(255,255,255,0.56)",
              fontSize: "14px",
              lineHeight: 1.8,
              maxWidth: "320px",
            }}
          >
            Entre ton mot de passe pour ouvrir le backoffice et piloter la
            plateforme.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: "28px" }}>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                marginBottom: "10px",
                color: "rgba(255,255,255,0.74)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.3px",
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
                height: "54px",
                padding: "0 16px",
                boxSizing: "border-box",
                borderRadius: "16px",
                border: error
                  ? "1px solid rgba(200,106,106,0.55)"
                  : "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                color: "#ffffff",
                outline: "none",
                fontSize: "14px",
                transition: "all .18s ease",
              }}
            />

            {error ? (
              <p
                style={{
                  margin: "12px 0 0",
                  color: "#E6B0B0",
                  fontSize: "12px",
                  lineHeight: 1.6,
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
                height: "54px",
                marginTop: "18px",
                border: "none",
                borderRadius: "999px",
                background:
                  "linear-gradient(135deg, #F5E6A2, #D4AF37, #A0781E)",
                color: "#050505",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.4px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.72 : 1,
                boxShadow: "0 16px 40px rgba(212,175,55,0.16)",
              }}
            >
              {loading ? "Connexion..." : "Entrer dans le backoffice"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}