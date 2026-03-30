import { useState, useEffect, useMemo } from "react";

// ============================================================
// CONFIGURATION
// ============================================================
const SUPABASE_URL = "https://hcasdniyxiomqezxnaqa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Yh8gU-n0pdIJNm0pO4ep6w_L6HqNslB";

// ============================================================
// SUPABASE REST HELPER
// ============================================================
const supabase = {
  async query(table, { select = "*", order, limit, offset, filters } = {}) {
    let url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
    if (order) url += `&order=${order}`;
    if (limit) url += `&limit=${limit}`;
    if (offset) url += `&offset=${offset}`;
    if (filters) url += `&${filters}`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "count=exact",
      },
    });

    const count = res.headers.get("content-range")?.split("/")[1];
    const data = await res.json();
    return { data, count: count ? parseInt(count, 10) : data.length };
  },

  async insert(table, body) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  async update(table, id, body, idCol = "id") {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?${idCol}=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(body),
      }
    );
    return res.json();
  },

  async delete(table, id, idCol = "id") {
    return fetch(`${SUPABASE_URL}/rest/v1/${table}?${idCol}=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
  },
};

// ============================================================
// THEME
// ============================================================
const font = `'DM Sans', system-ui, sans-serif`;
const fontMono = `'JetBrains Mono', monospace`;

const theme = {
  bg: "#000000",
  bgSoft: "#050505",
  surface: "#0A0A0A",
  surface2: "#101010",
  surface3: "#141414",
  surfaceHover: "#171717",
  surfaceActive: "#1C1C1C",

  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.10)",
  line: "rgba(255,255,255,0.08)",

  text: "#FFFFFF",
  textSoft: "rgba(255,255,255,0.76)",
  textMuted: "rgba(255,255,255,0.48)",
  textGhost: "rgba(255,255,255,0.24)",

  goldLight: "#F5E6A2",
  gold: "#D4AF37",
  goldDeep: "#A0781E",

  accent: "#D4AF37",
  accentSoft: "rgba(212,175,55,0.14)",
  accentBorder: "rgba(212,175,55,0.26)",

  success: "#8FBF8F",
  successSoft: "rgba(143,191,143,0.14)",

  danger: "#C86A6A",
  dangerSoft: "rgba(200,106,106,0.14)",

  info: "#A9B7D1",
  infoSoft: "rgba(169,183,209,0.14)",

  shadow: "0 24px 80px rgba(0,0,0,0.42)",
};

// ============================================================
// ICONS
// ============================================================
const icons = {
  dashboard: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  users: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <circle cx="18" cy="8" r="3" />
      <path d="M21 21v-1.5a3 3 0 00-3-3" />
    </svg>
  ),
  requests: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  events: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  ),
  concours: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  ),
  map: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  notif: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  chevron: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9,18 15,12 9,6" />
    </svg>
  ),
  search: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  refresh: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23,4 23,10 17,10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  ),
  trash: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),
  edit: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  eye: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  close: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  plane: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  car: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M5 17h14M5 17a2 2 0 01-2-2v-4l2-5h14l2 5v4a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  ),
  home: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    </svg>
  ),
  yacht: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 20s4-2 10-2 10 2 10 2M12 4v14M12 4L4 18M12 4l8 14" />
    </svg>
  ),
  influencer: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8l2 2 4-4" />
    </svg>
  ),
};

// ============================================================
// DEMO DATA
// ============================================================
const DEMO_MODE = SUPABASE_URL.includes("YOUR_PROJECT");

const demoData = {
  profiles: [
    {
      id: "a1b2c3",
      full_name: "Jean Dupont",
      email: "jean@mail.com",
      phone: "+33612345678",
      is_vip: true,
      created_at: "2026-03-01T10:00:00Z",
    },
    {
      id: "d4e5f6",
      full_name: "Marie Laurent",
      email: "marie@mail.com",
      phone: "+33698765432",
      is_vip: false,
      created_at: "2026-03-10T14:30:00Z",
    },
    {
      id: "g7h8i9",
      full_name: "Pierre Martin",
      email: "pierre@mail.com",
      phone: "+33611223344",
      is_vip: true,
      created_at: "2026-03-15T09:00:00Z",
    },
    {
      id: "j1k2l3",
      full_name: "Sophie Bernard",
      email: "sophie@mail.com",
      phone: "+33655667788",
      is_vip: false,
      created_at: "2026-03-20T16:00:00Z",
    },
    {
      id: "m4n5o6",
      full_name: "Lucas Moreau",
      email: "lucas@mail.com",
      phone: "+33699887766",
      is_vip: true,
      created_at: "2026-03-25T11:00:00Z",
    },
  ],
  events: [
    {
      id: 1,
      artist: "DJ Snake",
      type: "Concert",
      place: "Accor Arena, Paris",
      date: "12 Avril 2026",
      time: "21:00",
      isodate: "2026-04-12T19:00:00Z",
      image: "",
      created_at: "2026-03-26T17:03:05Z",
      description: "Le show explosif de DJ Snake",
    },
    {
      id: 2,
      artist: "Aya Nakamura",
      type: "Concert",
      place: "Stade de France, Paris",
      date: "25 Avril 2026",
      time: "20:30",
      isodate: "2026-04-25T18:30:00Z",
      image: "",
      created_at: "2026-03-26T17:03:05Z",
      description: "Aya Nakamura en concert",
    },
    {
      id: 3,
      artist: "Gala Just Agency",
      type: "Soirée VIP",
      place: "Hôtel Plaza Athénée, Paris",
      date: "3 Mai 2026",
      time: "22:00",
      isodate: "2026-05-03T20:00:00Z",
      image: "",
      created_at: "2026-03-26T17:03:05Z",
      description: "Soirée exclusive réservée aux membres",
    },
  ],
  concours: [
    {
      id: 1,
      title: "Gagnez une Rolex Submariner",
      end_date: "2026-04-30T23:59:59Z",
      price_per_month: 1,
      is_active: true,
      created_at: "2026-03-26T15:49:53Z",
      description: "Ce mois-ci gagnez une Rolex",
      prize_name: "Rolex Submariner",
      prize_value: "9.500€",
      prize_image_url: "",
      background_image_url: "",
    },
  ],
  concours_winners: [
    {
      id: 1,
      title: "Rolex Submariner",
      value: "9.500€",
      image_url: "",
      created_at: "2026-03-01T10:00:00Z",
    },
  ],
  biens_demandes: [
    {
      id: 1,
      type: "Villa",
      period: "1 semaine",
      price: 5000,
      people: 6,
      start_date: "2026-05-01",
      end_date: "2026-05-08",
      notes: "Vue mer souhaitée",
      contact_name: "Jean Dupont",
      contact_email: "jean@mail.com",
      contact_phone: "+33612345678",
      created_at: "2026-03-20T10:00:00Z",
    },
  ],
  jets_demandes: [
    {
      id: 1,
      from_code: "CDG",
      to_code: "NCE",
      trip_type: "Aller simple",
      people: 4,
      date_start: "2026-04-15",
      date_end: "2026-04-15",
      notes: "Champagne à bord",
      contact_name: "Pierre Martin",
      contact_email: "pierre@mail.com",
      contact_phone: "+33611223344",
      created_at: "2026-03-22T10:00:00Z",
    },
  ],
  vehicules_demandes: [
    {
      id: 1,
      type: "Lamborghini",
      period: "Week-end",
      budget: 3000,
      start_date: "2026-04-20",
      end_date: "2026-04-22",
      notes: "Couleur noire préférée",
      contact_name: "Lucas Moreau",
      contact_email: "lucas@mail.com",
      contact_phone: "+33699887766",
      created_at: "2026-03-23T10:00:00Z",
    },
  ],
  yachts_demandes: [
    {
      id: 1,
      trip_mode: "Croisière",
      from_port: "Monaco",
      to_port: "Saint-Tropez",
      people: 8,
      date_start: "2026-06-01",
      date_end: "2026-06-07",
      yacht_category: "Mega Yacht",
      cruise_style: "Luxe",
      notes: "Chef cuisinier requis",
      contact_name: "Sophie Bernard",
      contact_email: "sophie@mail.com",
      contact_phone: "+33655667788",
      created_at: "2026-03-24T10:00:00Z",
    },
  ],
  influenceurs_demandes: [
    {
      id: 1,
      brand: "Louis Vuitton",
      sector: "Mode",
      budget: 15000,
      message: "Campagne Instagram Stories",
      contact_name: "Marie Laurent",
      contact_email: "marie@mail.com",
      contact_phone: "+33698765432",
      created_at: "2026-03-25T10:00:00Z",
    },
  ],
  map_categories: [
    {
      id: 1,
      key: "biens",
      label: "Biens",
      icon_url: null,
      position: 1,
      center_lat: 48.828,
      center_lng: 2.3302,
      zoom: 15,
      created_at: "2026-03-26T00:51:52Z",
    },
    {
      id: 2,
      key: "vehicules",
      label: "Véhicules",
      icon_url: null,
      position: 2,
      center_lat: 48.825,
      center_lng: 2.32,
      zoom: 15,
      created_at: "2026-03-26T00:51:52Z",
    },
    {
      id: 3,
      key: "jet",
      label: "Jet Privé",
      icon_url: null,
      position: 3,
      center_lat: 48.9497,
      center_lng: 2.4372,
      zoom: 14,
      created_at: "2026-03-26T00:51:52Z",
    },
    {
      id: 4,
      key: "yacht",
      label: "Yacht",
      icon_url: null,
      position: 4,
      center_lat: 43.2725,
      center_lng: 6.6363,
      zoom: 14,
      created_at: "2026-03-26T00:51:52Z",
    },
  ],
  map_points: [
    {
      id: 1,
      title: "Immobilier Paris 14e",
      lat: 48.828,
      lng: 2.3302,
      category: "biens",
      image_url: null,
      is_active: true,
      created_at: "2026-03-26T03:58:53Z",
    },
    {
      id: 2,
      title: "Véhicules Paris 14e",
      lat: 48.825,
      lng: 2.32,
      category: "vehicules",
      image_url: null,
      is_active: true,
      created_at: "2026-03-26T03:58:53Z",
    },
    {
      id: 3,
      title: "Jet Privé Le Bourget",
      lat: 48.9497,
      lng: 2.4372,
      category: "jet",
      image_url: null,
      is_active: true,
      created_at: "2026-03-26T03:58:53Z",
    },
    {
      id: 4,
      title: "Yacht Saint-Tropez",
      lat: 43.2725,
      lng: 6.6363,
      category: "yacht",
      image_url: null,
      is_active: true,
      created_at: "2026-03-26T03:58:53Z",
    },
  ],
};

async function fetchData(table, options = {}) {
  if (DEMO_MODE) {
    const data = demoData[table] || [];
    return { data, count: data.length };
  }
  return supabase.query(table, options);
}

// ============================================================
// DATE UTILS
// ============================================================
function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(d) {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

// ============================================================
// UI COMPONENTS
// ============================================================
function Badge({ children, color = "accent", style: s }) {
  const colors = {
    accent: {
      bg: theme.accentSoft,
      text: theme.goldLight,
      border: theme.accentBorder,
    },
    danger: {
      bg: theme.dangerSoft,
      text: "#E6B0B0",
      border: "rgba(200,106,106,0.22)",
    },
    success: {
      bg: theme.successSoft,
      text: "#CFE7CF",
      border: "rgba(143,191,143,0.22)",
    },
    info: {
      bg: theme.infoSoft,
      text: "#D6DDEC",
      border: "rgba(169,183,209,0.20)",
    },
    muted: {
      bg: "rgba(255,255,255,0.04)",
      text: theme.textSoft,
      border: "rgba(255,255,255,0.08)",
    },
  };

  const c = colors[color] || colors.accent;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 11px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: "uppercase",
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        fontFamily: font,
        whiteSpace: "nowrap",
        ...s,
      }}
    >
      {children}
    </span>
  );
}

function StatCard({ label, value, icon, color = theme.accent }) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.005))",
        borderRadius: 24,
        padding: "24px 24px 22px",
        border: `1px solid ${theme.border}`,
        flex: "1 1 210px",
        minWidth: 220,
        position: "relative",
        overflow: "hidden",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top right, rgba(212,175,55,0.08), transparent 34%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
          color: theme.textMuted,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}
      >
        <span style={{ color }}>{icon}</span>
        {label}
      </div>

      <div
        style={{
          fontSize: 38,
          lineHeight: 1,
          fontWeight: 700,
          color: theme.text,
          letterSpacing: -1.6,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function DataTable({ columns, data, onRowClick, actions }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return data;
    const s = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const v = row[col.key];
        return v && String(v).toLowerCase().includes(s);
      })
    );
  }, [data, search, columns]);

  return (
    <div>
      <div style={{ marginBottom: 18, position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            color: theme.textGhost,
          }}
        >
          {icons.search}
        </span>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          style={{
            width: "100%",
            padding: "13px 16px 13px 44px",
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            color: theme.text,
            fontSize: 13,
            fontFamily: font,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          overflowX: "auto",
          borderRadius: 24,
          border: `1px solid ${theme.border}`,
          background: theme.surface,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
          }}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: "left",
                    padding: "16px 18px",
                    color: theme.textGhost,
                    fontWeight: 600,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1.4,
                    borderBottom: `1px solid ${theme.line}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.label}
                </th>
              ))}

              {actions && (
                <th
                  style={{
                    textAlign: "right",
                    padding: "16px 18px",
                    color: theme.textGhost,
                    fontWeight: 600,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1.4,
                    borderBottom: `1px solid ${theme.line}`,
                    width: 110,
                  }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  style={{
                    padding: 46,
                    textAlign: "center",
                    color: theme.textMuted,
                    fontSize: 13,
                  }}
                >
                  Aucun résultat
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={row.id || i}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    cursor: onRowClick ? "pointer" : "default",
                    borderBottom:
                      i < filtered.length - 1 ? `1px solid ${theme.line}` : "none",
                    transition: "background .18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "15px 18px",
                        color: theme.textSoft,
                        whiteSpace: "nowrap",
                        maxWidth: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? "—"}
                    </td>
                  ))}

                  {actions && (
                    <td style={{ padding: "15px 18px", textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "flex-end",
                        }}
                      >
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: theme.textGhost }}>
        {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
      </div>
    </div>
  );
}

function IconBtn({ icon, onClick, color = theme.textMuted, title, danger }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      title={title}
      style={{
        width: 34,
        height: 34,
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${theme.border}`,
        cursor: "pointer",
        borderRadius: 999,
        color: danger ? "#E6B0B0" : color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger
          ? theme.dangerSoft
          : "rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
    >
      {icon}
    </button>
  );
}

function Btn({ children, onClick, variant = "primary", style: s, disabled }) {
  const styles = {
    primary: {
      bg: `linear-gradient(135deg, ${theme.goldLight}, ${theme.gold}, ${theme.goldDeep})`,
      color: "#050505",
      border: "transparent",
      hover: 0.92,
    },
    secondary: {
      bg: "rgba(255,255,255,0.03)",
      color: theme.text,
      border: theme.border,
      hover: 1,
    },
    danger: {
      bg: theme.dangerSoft,
      color: "#E6B0B0",
      border: "rgba(200,106,106,0.18)",
      hover: 1,
    },
  };

  const st = styles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "11px 18px",
        borderRadius: 999,
        border: `1px solid ${st.border}`,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.4,
        fontFamily: font,
        background: st.bg,
        color: st.color,
        transition: "all .18s ease",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        ...s,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.opacity = String(st.hover);
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "1";
      }}
    >
      {children}
    </button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.76)",
        backdropFilter: "blur(12px)",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surface,
          borderRadius: 28,
          border: `1px solid ${theme.border}`,
          width: "100%",
          maxWidth: 720,
          maxHeight: "85vh",
          overflow: "auto",
          boxShadow: theme.shadow,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 24px",
            borderBottom: `1px solid ${theme.line}`,
            position: "sticky",
            top: 0,
            background: theme.surface,
            zIndex: 1,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: theme.text,
              letterSpacing: -0.4,
            }}
          >
            {title}
          </h3>
          <IconBtn icon={icons.close} onClick={onClose} />
        </div>

        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "13px 0",
        borderBottom: `1px solid ${theme.line}`,
        gap: 20,
      }}
    >
      <span
        style={{
          width: 170,
          flexShrink: 0,
          color: theme.textGhost,
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          paddingTop: 2,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: theme.textSoft,
          fontSize: 13,
          wordBreak: "break-word",
          lineHeight: 1.6,
        }}
      >
        {typeof value === "object" && value !== null ? (
          <code
            style={{
              fontSize: 11,
              fontFamily: fontMono,
              color: theme.textSoft,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${theme.border}`,
              padding: "10px 12px",
              borderRadius: 14,
              display: "block",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(value, null, 2)}
          </code>
        ) : (
          value ?? "—"
        )}
      </span>
    </div>
  );
}

// ============================================================
// PAGES
// ============================================================
function DashboardPage({ data }) {
  const totalDemandes =
    (data.biens_demandes?.length || 0) +
    (data.jets_demandes?.length || 0) +
    (data.vehicules_demandes?.length || 0) +
    (data.yachts_demandes?.length || 0) +
    (data.influenceurs_demandes?.length || 0);

  const recentDemandes = [
    ...(data.biens_demandes || []).map((d) => ({
      ...d,
      _type: "Bien",
      _icon: icons.home,
    })),
    ...(data.jets_demandes || []).map((d) => ({
      ...d,
      _type: "Jet",
      _icon: icons.plane,
    })),
    ...(data.vehicules_demandes || []).map((d) => ({
      ...d,
      _type: "Véhicule",
      _icon: icons.car,
    })),
    ...(data.yachts_demandes || []).map((d) => ({
      ...d,
      _type: "Yacht",
      _icon: icons.yacht,
    })),
    ...(data.influenceurs_demandes || []).map((d) => ({
      ...d,
      _type: "Influenceur",
      _icon: icons.influencer,
    })),
  ]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <StatCard
          label="Utilisateurs"
          value={data.profiles?.length || 0}
          icon={icons.users}
          color={theme.info}
        />
        <StatCard
          label="Demandes"
          value={totalDemandes}
          icon={icons.requests}
          color={theme.accent}
        />
        <StatCard
          label="Events"
          value={data.events?.length || 0}
          icon={icons.events}
          color={theme.success}
        />
        <StatCard
          label="Concours actifs"
          value={data.concours?.filter((c) => c.is_active).length || 0}
          icon={icons.concours}
          color={theme.accent}
        />
        <StatCard
          label="VIP"
          value={data.profiles?.filter((p) => p.is_vip).length || 0}
          icon={icons.users}
          color={theme.accent}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: theme.textGhost,
            marginBottom: 8,
          }}
        >
          Activité récente
        </div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: theme.text,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          Dernières demandes
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {recentDemandes.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 18px",
              background: theme.surface,
              borderRadius: 20,
              border: `1px solid ${theme.border}`,
            }}
          >
            <span style={{ color: theme.accent }}>{d._icon}</span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: theme.text,
                }}
              >
                {d.contact_name || d.brand || "—"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: theme.textMuted,
                  marginTop: 4,
                }}
              >
                {d.contact_email || ""}
              </div>
            </div>

            <Badge color="info">{d._type}</Badge>

            <span
              style={{
                fontSize: 11,
                color: theme.textGhost,
                whiteSpace: "nowrap",
              }}
            >
              {timeAgo(d.created_at)}
            </span>
          </div>
        ))}

        {recentDemandes.length === 0 && (
          <div
            style={{
              padding: 34,
              textAlign: "center",
              color: theme.textMuted,
              fontSize: 13,
              background: theme.surface,
              borderRadius: 20,
              border: `1px solid ${theme.border}`,
            }}
          >
            Aucune demande pour le moment
          </div>
        )}
      </div>
    </div>
  );
}

function ProfilesPage({ data }) {
  const [selected, setSelected] = useState(null);
  const profiles = data.profiles || [];

  return (
    <div>
      <DataTable
        columns={[
          {
            key: "full_name",
            label: "Nom",
            render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
          },
          { key: "email", label: "Email" },
          { key: "phone", label: "Téléphone" },
          {
            key: "is_vip",
            label: "Statut",
            render: (v) =>
              v ? <Badge color="accent">VIP</Badge> : <Badge color="muted">Standard</Badge>,
          },
          {
            key: "created_at",
            label: "Inscrit le",
            render: (v) => formatDate(v),
          },
        ]}
        data={profiles}
        onRowClick={setSelected}
        actions={(row) => [
          <IconBtn key="v" icon={icons.eye} title="Voir" onClick={() => setSelected(row)} />,
        ]}
      />

      {selected && (
        <Modal title="Détails utilisateur" onClose={() => setSelected(null)}>
          <DetailRow label="ID" value={selected.id} />
          <DetailRow label="Nom complet" value={selected.full_name} />
          <DetailRow label="Email" value={selected.email} />
          <DetailRow label="Téléphone" value={selected.phone} />
          <DetailRow label="VIP" value={selected.is_vip ? "Oui" : "Non"} />
          <DetailRow label="Inscrit le" value={formatDateTime(selected.created_at)} />
        </Modal>
      )}
    </div>
  );
}

function DemandesPage({ data }) {
  const [tab, setTab] = useState("biens");
  const [selected, setSelected] = useState(null);

  const tabs = [
    { key: "biens", label: "Biens", icon: icons.home, table: "biens_demandes" },
    { key: "vehicules", label: "Véhicules", icon: icons.car, table: "vehicules_demandes" },
    { key: "jets", label: "Jets", icon: icons.plane, table: "jets_demandes" },
    { key: "yachts", label: "Yachts", icon: icons.yacht, table: "yachts_demandes" },
    {
      key: "influenceurs",
      label: "Influenceurs",
      icon: icons.influencer,
      table: "influenceurs_demandes",
    },
  ];

  const activeTab = tabs.find((t) => t.key === tab);
  const tableData = data[activeTab.table] || [];

  const commonCols = [
    {
      key: "id",
      label: "ID",
      render: (v) => (
        <span style={{ fontFamily: fontMono, fontSize: 11, color: theme.textGhost }}>
          #{v}
        </span>
      ),
    },
    {
      key: "contact_name",
      label: "Contact",
      render: (v) => <span style={{ fontWeight: 600 }}>{v || "—"}</span>,
    },
    { key: "contact_email", label: "Email" },
    { key: "created_at", label: "Date", render: (v) => formatDate(v) },
  ];

  const extraCols = {
    biens: [
      { key: "type", label: "Type", render: (v) => <Badge color="info">{v}</Badge> },
      { key: "price", label: "Prix", render: (v) => (v ? `${v.toLocaleString()}€` : "—") },
      { key: "people", label: "Pers." },
    ],
    vehicules: [
      { key: "type", label: "Type", render: (v) => <Badge color="info">{v}</Badge> },
      { key: "budget", label: "Budget", render: (v) => (v ? `${v.toLocaleString()}€` : "—") },
      { key: "period", label: "Période" },
    ],
    jets: [
      { key: "from_code", label: "De" },
      { key: "to_code", label: "Vers" },
      { key: "trip_type", label: "Type", render: (v) => <Badge color="info">{v}</Badge> },
      { key: "people", label: "Pers." },
    ],
    yachts: [
      { key: "from_port", label: "Départ" },
      { key: "to_port", label: "Arrivée" },
      {
        key: "yacht_category",
        label: "Catégorie",
        render: (v) => <Badge color="accent">{v}</Badge>,
      },
      { key: "people", label: "Pers." },
    ],
    influenceurs: [
      {
        key: "brand",
        label: "Marque",
        render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
      },
      { key: "sector", label: "Secteur" },
      { key: "budget", label: "Budget", render: (v) => (v ? `${v.toLocaleString()}€` : "—") },
    ],
  };

  const columns = [
    ...commonCols.slice(0, 2),
    ...(extraCols[tab] || []),
    ...commonCols.slice(2),
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setSelected(null);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 999,
              border:
                tab === t.key
                  ? `1px solid ${theme.accentBorder}`
                  : `1px solid ${theme.border}`,
              background: tab === t.key ? theme.accentSoft : "rgba(255,255,255,0.02)",
              color: tab === t.key ? theme.goldLight : theme.textSoft,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: font,
              transition: "all .18s ease",
            }}
          >
            {t.icon}
            {t.label}
            <span
              style={{
                fontSize: 10,
                fontFamily: fontMono,
                background: tab === t.key ? theme.accent : "rgba(255,255,255,0.05)",
                color: tab === t.key ? "#050505" : theme.textGhost,
                padding: "3px 7px",
                borderRadius: 999,
                marginLeft: 2,
              }}
            >
              {(data[t.table] || []).length}
            </span>
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        onRowClick={setSelected}
        actions={(row) => [
          <IconBtn key="v" icon={icons.eye} title="Voir" onClick={() => setSelected(row)} />,
        ]}
      />

      {selected && (
        <Modal
          title={`Demande #${selected.id} — ${activeTab.label}`}
          onClose={() => setSelected(null)}
        >
          {Object.entries(selected).map(([k, v]) => (
            <DetailRow key={k} label={k.replace(/_/g, " ")} value={v} />
          ))}
        </Modal>
      )}
    </div>
  );
}

function EventsPage({ data }) {
  const [selected, setSelected] = useState(null);
  const events = data.events || [];

  return (
    <div>
      <DataTable
        columns={[
          {
            key: "id",
            label: "ID",
            render: (v) => (
              <span style={{ fontFamily: fontMono, fontSize: 11, color: theme.textGhost }}>
                #{v}
              </span>
            ),
          },
          {
            key: "artist",
            label: "Artiste / Nom",
            render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
          },
          { key: "type", label: "Type", render: (v) => <Badge color="info">{v}</Badge> },
          { key: "place", label: "Lieu" },
          { key: "date", label: "Date" },
          { key: "time", label: "Heure" },
        ]}
        data={events}
        onRowClick={setSelected}
        actions={(row) => [
          <IconBtn key="v" icon={icons.eye} title="Voir" onClick={() => setSelected(row)} />,
        ]}
      />

      {selected && (
        <Modal title={`Event: ${selected.artist}`} onClose={() => setSelected(null)}>
          {Object.entries(selected).map(([k, v]) => (
            <DetailRow key={k} label={k.replace(/_/g, " ")} value={v} />
          ))}
        </Modal>
      )}
    </div>
  );
}

function ConcoursPage({ data }) {
  const [selected, setSelected] = useState(null);
  const [showWinners, setShowWinners] = useState(false);
  const concours = data.concours || [];
  const winners = data.concours_winners || [];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Btn variant={!showWinners ? "primary" : "secondary"} onClick={() => setShowWinners(false)}>
          {icons.concours}
          Concours
        </Btn>
        <Btn variant={showWinners ? "primary" : "secondary"} onClick={() => setShowWinners(true)}>
          Gagnants
        </Btn>
      </div>

      {!showWinners ? (
        <DataTable
          columns={[
            {
              key: "id",
              label: "ID",
              render: (v) => (
                <span style={{ fontFamily: fontMono, fontSize: 11, color: theme.textGhost }}>
                  #{v}
                </span>
              ),
            },
            {
              key: "title",
              label: "Titre",
              render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
            },
            { key: "prize_name", label: "Prix" },
            { key: "prize_value", label: "Valeur", render: (v) => <Badge color="accent">{v}</Badge> },
            {
              key: "is_active",
              label: "Statut",
              render: (v) =>
                v ? <Badge color="success">Actif</Badge> : <Badge color="muted">Terminé</Badge>,
            },
            { key: "end_date", label: "Fin", render: (v) => formatDate(v) },
          ]}
          data={concours}
          onRowClick={setSelected}
          actions={(row) => [
            <IconBtn key="v" icon={icons.eye} title="Voir" onClick={() => setSelected(row)} />,
          ]}
        />
      ) : (
        <DataTable
          columns={[
            {
              key: "id",
              label: "ID",
              render: (v) => (
                <span style={{ fontFamily: fontMono, fontSize: 11, color: theme.textGhost }}>
                  #{v}
                </span>
              ),
            },
            {
              key: "title",
              label: "Titre",
              render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
            },
            { key: "value", label: "Valeur", render: (v) => <Badge color="accent">{v}</Badge> },
            { key: "created_at", label: "Date", render: (v) => formatDate(v) },
          ]}
          data={winners}
          onRowClick={setSelected}
          actions={(row) => [
            <IconBtn key="v" icon={icons.eye} title="Voir" onClick={() => setSelected(row)} />,
          ]}
        />
      )}

      {selected && (
        <Modal title={selected.title || "Détails"} onClose={() => setSelected(null)}>
          {Object.entries(selected).map(([k, v]) => (
            <DetailRow key={k} label={k.replace(/_/g, " ")} value={v} />
          ))}
        </Modal>
      )}
    </div>
  );
}

function MapPage({ data }) {
  const [selected, setSelected] = useState(null);
  const [showPoints, setShowPoints] = useState(true);
  const categories = data.map_categories || [];
  const points = data.map_points || [];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Btn variant={showPoints ? "primary" : "secondary"} onClick={() => setShowPoints(true)}>
          {icons.map}
          Points
        </Btn>
        <Btn variant={!showPoints ? "primary" : "secondary"} onClick={() => setShowPoints(false)}>
          Catégories
        </Btn>
      </div>

      {showPoints ? (
        <DataTable
          columns={[
            {
              key: "id",
              label: "ID",
              render: (v) => (
                <span style={{ fontFamily: fontMono, fontSize: 11, color: theme.textGhost }}>
                  #{v}
                </span>
              ),
            },
            {
              key: "title",
              label: "Titre",
              render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
            },
            { key: "category", label: "Catégorie", render: (v) => <Badge color="info">{v}</Badge> },
            {
              key: "lat",
              label: "Lat",
              render: (v) => <span style={{ fontFamily: fontMono, fontSize: 11 }}>{v}</span>,
            },
            {
              key: "lng",
              label: "Lng",
              render: (v) => <span style={{ fontFamily: fontMono, fontSize: 11 }}>{v}</span>,
            },
            {
              key: "is_active",
              label: "Actif",
              render: (v) =>
                v ? <Badge color="success">Oui</Badge> : <Badge color="danger">Non</Badge>,
            },
          ]}
          data={points}
          onRowClick={setSelected}
          actions={(row) => [
            <IconBtn key="v" icon={icons.eye} title="Voir" onClick={() => setSelected(row)} />,
          ]}
        />
      ) : (
        <DataTable
          columns={[
            {
              key: "id",
              label: "ID",
              render: (v) => (
                <span style={{ fontFamily: fontMono, fontSize: 11, color: theme.textGhost }}>
                  #{v}
                </span>
              ),
            },
            {
              key: "label",
              label: "Label",
              render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
            },
            { key: "key", label: "Clé", render: (v) => <Badge color="muted">{v}</Badge> },
            { key: "position", label: "Position" },
            { key: "zoom", label: "Zoom" },
          ]}
          data={categories}
          onRowClick={setSelected}
          actions={(row) => [
            <IconBtn key="v" icon={icons.eye} title="Voir" onClick={() => setSelected(row)} />,
          ]}
        />
      )}

      {selected && (
        <Modal title={selected.title || selected.label || "Détails"} onClose={() => setSelected(null)}>
          {Object.entries(selected).map(([k, v]) => (
            <DetailRow key={k} label={k.replace(/_/g, " ")} value={v} />
          ))}
        </Modal>
      )}
    </div>
  );
}

function NotificationsPage() {
  return (
    <div
      style={{
        minHeight: 420,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          padding: 36,
          borderRadius: 28,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.005))",
          border: `1px solid ${theme.border}`,
          textAlign: "center",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: theme.accentSoft,
            border: `1px solid ${theme.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.accent,
            margin: "0 auto 20px",
          }}
        >
          {icons.notif}
        </div>

        <h3
          style={{
            color: theme.text,
            margin: 0,
            fontSize: 22,
            letterSpacing: -0.6,
          }}
        >
          Notifications Push
        </h3>

        <p
          style={{
            color: theme.textSoft,
            fontSize: 13,
            maxWidth: 420,
            margin: "14px auto 0",
            lineHeight: 1.8,
          }}
        >
          Cette section sera disponible quand ton service de push sera branché.
          On pourra ensuite piloter les campagnes depuis cette console privée.
        </p>

        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 18,
            flexWrap: "wrap",
          }}
        >
          <Badge color="muted">FCM</Badge>
          <Badge color="muted">OneSignal</Badge>
          <Badge color="muted">Expo</Badge>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: icons.dashboard },
  { key: "profiles", label: "Utilisateurs", icon: icons.users },
  { key: "demandes", label: "Demandes", icon: icons.requests },
  { key: "events", label: "Events", icon: icons.events },
  { key: "concours", label: "Concours", icon: icons.concours },
  { key: "map", label: "Carte", icon: icons.map },
  { key: "notifications", label: "Notifications", icon: icons.notif },
];

export default function BackOffice() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadData = async () => {
    setLoading(true);

    try {
      const tables = [
        "profiles",
        "events",
        "concours",
        "concours_winners",
        "biens_demandes",
        "jets_demandes",
        "vehicules_demandes",
        "yachts_demandes",
        "influenceurs_demandes",
        "map_categories",
        "map_points",
      ];

      const results = await Promise.all(tables.map((t) => fetchData(t)));
      const d = {};

      tables.forEach((t, i) => {
        d[t] = results[i].data;
      });

      setData(d);
    } catch (err) {
      console.error("Erreur chargement:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const pageTitle = NAV_ITEMS.find((n) => n.key === page)?.label || "";

  return (
    <div
      style={{
        fontFamily: font,
        background: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <aside
        style={{
          width: sidebarOpen ? 260 : 78,
          minHeight: "100vh",
          background: theme.surface,
          borderRight: `1px solid ${theme.border}`,
          transition: "width .28s ease",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: sidebarOpen ? "26px 22px" : "26px 16px",
            borderBottom: `1px solid ${theme.line}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 999,
              background: `linear-gradient(135deg, ${theme.goldLight}, ${theme.gold}, ${theme.goldDeep})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              color: "#050505",
              flexShrink: 0,
              boxShadow: "0 10px 30px rgba(212,175,55,0.18)",
            }}
          >
            JA
          </div>

          {sidebarOpen && (
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: theme.text,
                  letterSpacing: -0.3,
                }}
              >
                Just Admin
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: theme.textGhost,
                  marginTop: 2,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                }}
              >
                {DEMO_MODE ? "Mode démo" : "Console privée"}
              </div>
            </div>
          )}
        </div>

        <nav style={{ padding: "14px 10px", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: sidebarOpen ? "13px 14px" : "13px 0",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                borderRadius: 16,
                border:
                  page === item.key
                    ? `1px solid ${theme.accentBorder}`
                    : "1px solid transparent",
                cursor: "pointer",
                background: page === item.key ? theme.accentSoft : "transparent",
                color: page === item.key ? theme.goldLight : theme.textSoft,
                fontSize: 13,
                fontWeight: page === item.key ? 600 : 500,
                fontFamily: font,
                transition: "all .18s ease",
                marginBottom: 4,
              }}
              onMouseEnter={(e) => {
                if (page !== item.key) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }
              }}
              onMouseLeave={(e) => {
                if (page !== item.key) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {item.icon}
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>

        {DEMO_MODE && sidebarOpen && (
          <div
            style={{
              margin: "0 14px 18px",
              padding: "14px 16px",
              borderRadius: 20,
              background: theme.accentSoft,
              border: `1px solid ${theme.accentBorder}`,
              fontSize: 11,
              color: theme.goldLight,
              lineHeight: 1.7,
            }}
          >
            <strong style={{ display: "block", marginBottom: 4 }}>Mode démo</strong>
            Remplace les credentials Supabase pour connecter les vraies données.
          </div>
        )}
      </aside>

      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(circle at top right, rgba(212,175,55,0.05), transparent 26%), #000",
        }}
      >
        <header
          style={{
            padding: "22px 34px",
            borderBottom: `1px solid ${theme.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: theme.textGhost,
                marginBottom: 6,
              }}
            >
              Just Agency
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: -0.8,
              }}
            >
              {pageTitle}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Btn variant="secondary" onClick={loadData}>
              {icons.refresh}
              {loading ? "Chargement..." : "Actualiser"}
            </Btn>
          </div>
        </header>

        <div style={{ padding: 34, flex: 1 }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 320,
                color: theme.textSoft,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    border: `2px solid rgba(255,255,255,0.08)`,
                    borderTopColor: theme.accent,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 18px",
                  }}
                />
                Chargement des données...
              </div>
            </div>
          ) : (
            <>
              {page === "dashboard" && <DashboardPage data={data} />}
              {page === "profiles" && <ProfilesPage data={data} />}
              {page === "demandes" && <DemandesPage data={data} />}
              {page === "events" && <EventsPage data={data} />}
              {page === "concours" && <ConcoursPage data={data} />}
              {page === "map" && <MapPage data={data} />}
              {page === "notifications" && <NotificationsPage />}
            </>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        * { box-sizing: border-box; }

        html, body {
          background: #000;
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.12);
          border-radius: 999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.20);
        }

        input::placeholder {
          color: rgba(255,255,255,0.24);
        }
      `}</style>
    </div>
  );
}