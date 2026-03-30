export default function Home() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0f",
      color: "#fff",
      fontFamily: "sans-serif"
    }}>
      <div>
        <h1>Just Backoffice 🚀</h1>
        <p>Accès admin :</p>
        <a href="/admin" style={{ color: "#c8a44e" }}>
          Aller au backoffice
        </a>
      </div>
    </div>
  )
}