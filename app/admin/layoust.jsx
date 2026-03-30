import AdminTopbar from "@/components/AdminTopbar"

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <AdminTopbar />
      {children}
    </div>
  )
}