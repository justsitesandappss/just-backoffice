"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminTopbar() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      })
    } finally {
      router.push("/admin/login")
      router.refresh()
    }
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(10,10,15,0.88)",
        backdropFilter: "blur(12px)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <div>
        <div
          style={{
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          Just Admin
        </div>
        <div
          style={{
            color: "#8c8ca3",
            fontSize: 12,
            marginTop: 2,
          }}
        >
          Backoffice sécurisé
        </div>
      </div>

      <button
        onClick={handleLogout}
        disabled={loading}
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)",
          color: "#e8e8f0",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 13,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Déconnexion..." : "Déconnexion"}
      </button>
    </div>
  )
}