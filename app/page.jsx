export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(212,175,55,0.10), transparent 28%), #000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "720px",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            marginBottom: "18px",
          }}
        >
          Just Agency
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(64px, 14vw, 160px)",
            lineHeight: 0.95,
            letterSpacing: "-6px",
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          JUST
        </h1>

        <div
          style={{
            width: "90px",
            height: "1px",
            background: "rgba(255,255,255,0.10)",
            margin: "22px auto 20px",
          }}
        />

        <p
          style={{
            margin: "0 auto",
            maxWidth: "520px",
            fontSize: "14px",
            lineHeight: 1.9,
            color: "rgba(255,255,255,0.58)",
          }}
        >
          Console privée. Gestion des utilisateurs, demandes, événements,
          concours et contenus premium.
        </p>

        <div
          style={{
            marginTop: "34px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <a
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 24px",
              borderRadius: "999px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.6px",
              color: "#050505",
              background:
                "linear-gradient(135deg, #F5E6A2, #D4AF37, #A0781E)",
              boxShadow: "0 16px 40px rgba(212,175,55,0.18)",
            }}
          >
            Aller au backoffice
          </a>
        </div>
      </div>
    </main>
  );
}