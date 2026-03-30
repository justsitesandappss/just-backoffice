export const metadata = {
  title: "Just Admin",
  description: "Backoffice sécurisé",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a0a0f" }}>{children}</body>
    </html>
  )
}