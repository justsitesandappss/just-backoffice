import { useState, useEffect, useMemo } from "react";

// ============================================================
// CONFIGURATION
// ============================================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

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
      status: "nouveau",
      admin_note: "",
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
      status: "en_cours",
      admin_note: "Client VIP, priorité haute",
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
      status: "traite",
      admin_note: "Lamborghini Huracán réservée",
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
      status: "nouveau",
      admin_note: "",
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
      status: "refuse",
      admin_note: "Budget insuffisant pour ce type de campagne",
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

            <StatusBadge status={d.status || "nouveau"} />

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

function ProfilesPage({ data, onRefresh }) {
  const [selected, setSelected] = useState(null);
  const [vipFilter, setVipFilter] = useState("all");
  const profiles = data.profiles || [];

  const filtered =
    vipFilter === "all"
      ? profiles
      : vipFilter === "vip"
      ? profiles.filter((p) => p.is_vip)
      : profiles.filter((p) => !p.is_vip);

  const vipCount = profiles.filter((p) => p.is_vip).length;

  const handleToggleVip = async (row) => {
    try {
      await supabase.update("profiles", row.id, { is_vip: !row.is_vip });
      if (onRefresh) await onRefresh();
      if (selected && selected.id === row.id) {
        setSelected({ ...row, is_vip: !row.is_vip });
      }
    } catch (err) {
      console.error("Erreur toggle VIP:", err);
    }
  };

  return (
    <div>
      {/* VIP filter pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[
          { key: "all", label: "Tous", count: profiles.length },
          { key: "vip", label: "VIP", count: vipCount },
          { key: "standard", label: "Standard", count: profiles.length - vipCount },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setVipFilter(f.key)}
            style={{
              padding: "7px 13px",
              borderRadius: 999,
              border: `1px solid ${
                vipFilter === f.key ? theme.borderStrong : "rgba(255,255,255,0.04)"
              }`,
              background:
                vipFilter === f.key ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.01)",
              color: vipFilter === f.key ? theme.text : theme.textMuted,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: font,
              transition: "all .18s ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {f.key === "vip" && (
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.gold }} />
            )}
            {f.label}
            <span style={{ fontSize: 10, fontFamily: fontMono, color: theme.textGhost }}>{f.count}</span>
          </button>
        ))}
      </div>

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
        data={filtered}
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

          {/* VIP Toggle */}
          <div
            style={{
              marginTop: 24,
              padding: "16px 20px",
              background: selected.is_vip ? theme.accentSoft : theme.surface2,
              borderRadius: 18,
              border: `1px solid ${selected.is_vip ? theme.accentBorder : theme.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
                {selected.is_vip ? "Membre VIP" : "Membre Standard"}
              </div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
                {selected.is_vip
                  ? "Accès aux events VIP et concours exclusifs"
                  : "Promouvoir en VIP pour débloquer les avantages"}
              </div>
            </div>
            <Btn
              variant={selected.is_vip ? "danger" : "primary"}
              onClick={() => handleToggleVip(selected)}
            >
              {selected.is_vip ? "Retirer VIP" : "Promouvoir VIP"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// STATUS HELPERS
// ============================================================
const STATUS_CONFIG = {
  nouveau: { label: "Nouveau", color: "info", dot: "#A9B7D1" },
  en_cours: { label: "En cours", color: "accent", dot: "#D4AF37" },
  traite: { label: "Traité", color: "success", dot: "#8FBF8F" },
  refuse: { label: "Refusé", color: "danger", dot: "#C86A6A" },
};

const STATUS_OPTIONS = ["nouveau", "en_cours", "traite", "refuse"];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.nouveau;
  return (
    <Badge color={cfg.color}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          display: "inline-block",
          marginRight: 6,
        }}
      />
      {cfg.label}
    </Badge>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          color: theme.textGhost,
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: theme.surface2,
  border: `1px solid ${theme.border}`,
  borderRadius: 14,
  color: theme.text,
  fontSize: 13,
  fontFamily: font,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color .18s ease",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: 36,
  cursor: "pointer",
};

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(8px)",
        padding: 24,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: theme.surface,
          borderRadius: 24,
          border: `1px solid ${theme.border}`,
          padding: 28,
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          boxShadow: theme.shadow,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: theme.dangerSoft,
            border: `1px solid rgba(200,106,106,0.22)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#E6B0B0",
            margin: "0 auto 18px",
          }}
        >
          {icons.trash}
        </div>

        <p
          style={{
            color: theme.textSoft,
            fontSize: 14,
            lineHeight: 1.7,
            margin: "0 0 24px",
          }}
        >
          {message}
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn variant="secondary" onClick={onCancel}>
            Annuler
          </Btn>
          <Btn variant="danger" onClick={onConfirm}>
            {icons.trash}
            Supprimer
          </Btn>
        </div>
      </div>
    </div>
  );
}

function DemandesPage({ data, onRefresh }) {
  const [tab, setTab] = useState("biens");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

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
  const rawData = data[activeTab.table] || [];
  const tableData =
    statusFilter === "all"
      ? rawData
      : rawData.filter((r) => (r.status || "nouveau") === statusFilter);

  // Count by status across current tab
  const statusCounts = useMemo(() => {
    const counts = { all: rawData.length, nouveau: 0, en_cours: 0, traite: 0, refuse: 0 };
    rawData.forEach((r) => {
      const s = r.status || "nouveau";
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [rawData]);

  const handleUpdateStatus = async (row, newStatus) => {
    setSaving(true);
    try {
      await supabase.update(activeTab.table, row.id, { status: newStatus });
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error("Erreur update status:", err);
    }
    setSaving(false);
  };

  const handleSaveNote = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await supabase.update(activeTab.table, editing.id, {
        status: editing.status || "nouveau",
        admin_note: editing.admin_note || "",
      });
      if (onRefresh) await onRefresh();
      setEditing(null);
    } catch (err) {
      console.error("Erreur save:", err);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await supabase.delete(activeTab.table, deleteTarget.id);
      if (onRefresh) await onRefresh();
      setDeleteTarget(null);
      setSelected(null);
      setEditing(null);
    } catch (err) {
      console.error("Erreur delete:", err);
    }
    setDeleting(false);
  };

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
    {
      key: "status",
      label: "Statut",
      render: (v) => <StatusBadge status={v || "nouveau"} />,
    },
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

  // Keys to hide in detail modal
  const hiddenKeys = new Set(["_type", "_icon"]);

  return (
    <div>
      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setSelected(null);
              setEditing(null);
              setStatusFilter("all");
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

      {/* Status Filter Pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { key: "all", label: "Tous" },
          ...STATUS_OPTIONS.map((s) => ({ key: s, label: STATUS_CONFIG[s].label })),
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            style={{
              padding: "7px 13px",
              borderRadius: 999,
              border: `1px solid ${
                statusFilter === f.key ? theme.borderStrong : "rgba(255,255,255,0.04)"
              }`,
              background:
                statusFilter === f.key ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.01)",
              color: statusFilter === f.key ? theme.text : theme.textMuted,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: font,
              transition: "all .18s ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {f.key !== "all" && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: STATUS_CONFIG[f.key]?.dot || theme.textMuted,
                }}
              />
            )}
            {f.label}
            <span
              style={{
                fontSize: 10,
                fontFamily: fontMono,
                color: theme.textGhost,
                marginLeft: 2,
              }}
            >
              {statusCounts[f.key] || 0}
            </span>
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        onRowClick={setSelected}
        actions={(row) => [
          <IconBtn
            key="v"
            icon={icons.eye}
            title="Voir"
            onClick={() => setSelected(row)}
          />,
          <IconBtn
            key="e"
            icon={icons.edit}
            title="Gérer"
            onClick={() =>
              setEditing({
                ...row,
                status: row.status || "nouveau",
                admin_note: row.admin_note || "",
              })
            }
          />,
          <IconBtn
            key="d"
            icon={icons.trash}
            title="Supprimer"
            danger
            onClick={() => setDeleteTarget(row)}
          />,
        ]}
      />

      {/* Detail Modal */}
      {selected && !editing && (
        <Modal
          title={`Demande #${selected.id} — ${activeTab.label}`}
          onClose={() => setSelected(null)}
        >
          <div style={{ marginBottom: 20 }}>
            <StatusBadge status={selected.status || "nouveau"} />
          </div>

          {Object.entries(selected)
            .filter(([k]) => !hiddenKeys.has(k))
            .map(([k, v]) => {
              if (k === "status")
                return (
                  <DetailRow
                    key={k}
                    label="Statut"
                    value={STATUS_CONFIG[v]?.label || v || "Nouveau"}
                  />
                );
              if (k === "admin_note")
                return (
                  <DetailRow
                    key={k}
                    label="Note admin"
                    value={v || "Aucune note"}
                  />
                );
              return (
                <DetailRow key={k} label={k.replace(/_/g, " ")} value={v} />
              );
            })}

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 24,
              justifyContent: "flex-end",
            }}
          >
            <Btn
              variant="secondary"
              onClick={() => {
                setEditing({
                  ...selected,
                  status: selected.status || "nouveau",
                  admin_note: selected.admin_note || "",
                });
                setSelected(null);
              }}
            >
              {icons.edit}
              Gérer cette demande
            </Btn>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editing && (
        <Modal
          title={`Gérer — Demande #${editing.id}`}
          onClose={() => setEditing(null)}
        >
          {/* Quick status bar */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              padding: "16px 18px",
              background: theme.surface2,
              borderRadius: 18,
              border: `1px solid ${theme.border}`,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                color: theme.textGhost,
                display: "flex",
                alignItems: "center",
                marginRight: 6,
              }}
            >
              Statut rapide
            </span>
            {STATUS_OPTIONS.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const active = editing.status === s;
              return (
                <button
                  key={s}
                  onClick={() => setEditing({ ...editing, status: s })}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: active
                      ? `1px solid ${cfg.dot}`
                      : `1px solid ${theme.border}`,
                    background: active
                      ? `${cfg.dot}18`
                      : "rgba(255,255,255,0.02)",
                    color: active ? cfg.dot : theme.textMuted,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: font,
                    transition: "all .18s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: cfg.dot,
                      opacity: active ? 1 : 0.4,
                    }}
                  />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Contact summary */}
          <div
            style={{
              padding: "14px 18px",
              background: theme.surface2,
              borderRadius: 16,
              border: `1px solid ${theme.border}`,
              marginBottom: 20,
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: theme.textGhost,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Contact
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
                {editing.contact_name || editing.brand || "—"}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: theme.textGhost,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Email
              </div>
              <div style={{ fontSize: 13, color: theme.textSoft }}>
                {editing.contact_email || "—"}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: theme.textGhost,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Téléphone
              </div>
              <div style={{ fontSize: 13, color: theme.textSoft }}>
                {editing.contact_phone || "—"}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: theme.textGhost,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Reçue le
              </div>
              <div style={{ fontSize: 13, color: theme.textSoft }}>
                {formatDateTime(editing.created_at)}
              </div>
            </div>
          </div>

          {/* Admin note */}
          <FormField label="Note interne (admin)">
            <textarea
              value={editing.admin_note}
              onChange={(e) =>
                setEditing({ ...editing, admin_note: e.target.value })
              }
              rows={4}
              placeholder="Ajouter une note pour le suivi de cette demande..."
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: 90,
                lineHeight: 1.7,
              }}
            />
          </FormField>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 24,
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Btn
              variant="danger"
              onClick={() => setDeleteTarget(editing)}
            >
              {icons.trash}
              Supprimer
            </Btn>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="secondary" onClick={() => setEditing(null)}>
                Annuler
              </Btn>
              <Btn
                variant="primary"
                onClick={handleSaveNote}
                disabled={saving}
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Supprimer définitivement la demande #${deleteTarget.id} de ${
            deleteTarget.contact_name || deleteTarget.brand || "ce contact"
          } ? Cette action est irréversible.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function EventsPage({ data, onRefresh }) {
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const events = data.events || [];

  const emptyEvent = {
    artist: "",
    type: "Concert",
    place: "",
    date: "",
    time: "",
    isodate: "",
    image: "",
    description: "",
  };

  const [form, setForm] = useState(emptyEvent);

  const updateForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.artist || !form.date) return;
    setSaving(true);
    try {
      if (editing) {
        await supabase.update("events", editing.id, form);
      } else {
        await supabase.insert("events", form);
      }
      if (onRefresh) await onRefresh();
      setEditing(null);
      setCreating(false);
      setForm(emptyEvent);
    } catch (err) {
      console.error("Erreur save event:", err);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await supabase.delete("events", deleteTarget.id);
      if (onRefresh) await onRefresh();
      setDeleteTarget(null);
      setSelected(null);
      setEditing(null);
    } catch (err) {
      console.error("Erreur delete event:", err);
    }
    setSaving(false);
  };

  const openEdit = (row) => {
    setForm({
      artist: row.artist || "",
      type: row.type || "Concert",
      place: row.place || "",
      date: row.date || "",
      time: row.time || "",
      isodate: row.isodate || "",
      image: row.image || "",
      description: row.description || "",
    });
    setEditing(row);
    setCreating(false);
    setSelected(null);
  };

  const openCreate = () => {
    setForm(emptyEvent);
    setEditing(null);
    setCreating(true);
    setSelected(null);
  };

  const EVENT_TYPES = ["Concert", "Soirée VIP", "Festival", "Showcase", "Gala", "Autre"];

  const showForm = creating || editing;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <Btn variant="primary" onClick={openCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvel event
        </Btn>
      </div>

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
          <IconBtn key="e" icon={icons.edit} title="Modifier" onClick={() => openEdit(row)} />,
          <IconBtn key="d" icon={icons.trash} title="Supprimer" danger onClick={() => setDeleteTarget(row)} />,
        ]}
      />

      {/* Detail Modal */}
      {selected && !showForm && (
        <Modal title={`Event: ${selected.artist}`} onClose={() => setSelected(null)}>
          <DetailRow label="Artiste / Nom" value={selected.artist} />
          <DetailRow label="Type" value={selected.type} />
          <DetailRow label="Lieu" value={selected.place} />
          <DetailRow label="Date" value={selected.date} />
          <DetailRow label="Heure" value={selected.time} />
          <DetailRow label="Description" value={selected.description} />
          {selected.image && <DetailRow label="Image" value={selected.image} />}
          <DetailRow label="Créé le" value={formatDateTime(selected.created_at)} />

          <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
            <Btn variant="danger" onClick={() => { setDeleteTarget(selected); setSelected(null); }}>
              {icons.trash} Supprimer
            </Btn>
            <Btn variant="secondary" onClick={() => openEdit(selected)}>
              {icons.edit} Modifier
            </Btn>
          </div>
        </Modal>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <Modal
          title={editing ? `Modifier — ${editing.artist}` : "Nouvel event"}
          onClose={() => { setEditing(null); setCreating(false); setForm(emptyEvent); }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Artiste / Nom *">
              <input
                value={form.artist}
                onChange={(e) => updateForm("artist", e.target.value)}
                placeholder="Ex: DJ Snake"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Type">
              <select
                value={form.type}
                onChange={(e) => updateForm("type", e.target.value)}
                style={selectStyle}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: theme.surface2, color: theme.text }}>
                    {t}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Lieu">
            <input
              value={form.place}
              onChange={(e) => updateForm("place", e.target.value)}
              placeholder="Ex: Accor Arena, Paris"
              style={inputStyle}
            />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Date (affichée)">
              <input
                value={form.date}
                onChange={(e) => updateForm("date", e.target.value)}
                placeholder="Ex: 12 Avril 2026"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Heure">
              <input
                value={form.time}
                onChange={(e) => updateForm("time", e.target.value)}
                placeholder="Ex: 21:00"
                style={inputStyle}
              />
            </FormField>
          </div>

          <FormField label="Date ISO (pour tri)">
            <input
              type="datetime-local"
              value={form.isodate ? form.isodate.slice(0, 16) : ""}
              onChange={(e) => updateForm("isodate", e.target.value ? new Date(e.target.value).toISOString() : "")}
              style={inputStyle}
            />
          </FormField>

          <FormField label="URL de l'image">
            <input
              value={form.image}
              onChange={(e) => updateForm("image", e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="Description de l'event..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: 80, lineHeight: 1.7 }}
            />
          </FormField>

          <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => { setEditing(null); setCreating(false); setForm(emptyEvent); }}>
              Annuler
            </Btn>
            <Btn variant="primary" onClick={handleSave} disabled={saving || !form.artist}>
              {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Créer l'event"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Supprimer l'event "${deleteTarget.artist}" ? Cette action est irréversible.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function ConcoursPage({ data, onRefresh }) {
  const [selected, setSelected] = useState(null);
  const [showWinners, setShowWinners] = useState(false);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const concours = data.concours || [];
  const winners = data.concours_winners || [];

  const emptyConcours = {
    title: "",
    description: "",
    prize_name: "",
    prize_value: "",
    prize_image_url: "",
    background_image_url: "",
    end_date: "",
    price_per_month: 1,
    is_active: true,
  };

  const [form, setForm] = useState(emptyConcours);
  const updateForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        price_per_month: Number(form.price_per_month) || 0,
      };
      if (editing) {
        await supabase.update("concours", editing.id, payload);
      } else {
        await supabase.insert("concours", payload);
      }
      if (onRefresh) await onRefresh();
      setEditing(null);
      setCreating(false);
      setForm(emptyConcours);
    } catch (err) {
      console.error("Erreur save concours:", err);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const table = deleteTarget._isWinner ? "concours_winners" : "concours";
      await supabase.delete(table, deleteTarget.id);
      if (onRefresh) await onRefresh();
      setDeleteTarget(null);
      setSelected(null);
      setEditing(null);
    } catch (err) {
      console.error("Erreur delete concours:", err);
    }
    setSaving(false);
  };

  const handleToggleActive = async (row) => {
    try {
      await supabase.update("concours", row.id, { is_active: !row.is_active });
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error("Erreur toggle:", err);
    }
  };

  const openEdit = (row) => {
    setForm({
      title: row.title || "",
      description: row.description || "",
      prize_name: row.prize_name || "",
      prize_value: row.prize_value || "",
      prize_image_url: row.prize_image_url || "",
      background_image_url: row.background_image_url || "",
      end_date: row.end_date ? row.end_date.slice(0, 16) : "",
      price_per_month: row.price_per_month || 1,
      is_active: row.is_active ?? true,
    });
    setEditing(row);
    setCreating(false);
    setSelected(null);
  };

  const openCreate = () => {
    setForm(emptyConcours);
    setEditing(null);
    setCreating(true);
    setSelected(null);
  };

  const showForm = creating || editing;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant={!showWinners ? "primary" : "secondary"} onClick={() => setShowWinners(false)}>
            {icons.concours}
            Concours
            <span style={{
              fontSize: 10, fontFamily: fontMono,
              background: !showWinners ? "#050505" : "rgba(255,255,255,0.05)",
              color: !showWinners ? theme.accent : theme.textGhost,
              padding: "3px 7px", borderRadius: 999, marginLeft: 2,
            }}>{concours.length}</span>
          </Btn>
          <Btn variant={showWinners ? "primary" : "secondary"} onClick={() => setShowWinners(true)}>
            Gagnants
            <span style={{
              fontSize: 10, fontFamily: fontMono,
              background: showWinners ? "#050505" : "rgba(255,255,255,0.05)",
              color: showWinners ? theme.accent : theme.textGhost,
              padding: "3px 7px", borderRadius: 999, marginLeft: 2,
            }}>{winners.length}</span>
          </Btn>
        </div>

        {!showWinners && (
          <Btn variant="primary" onClick={openCreate}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouveau concours
          </Btn>
        )}
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
            <IconBtn key="e" icon={icons.edit} title="Modifier" onClick={() => openEdit(row)} />,
            <IconBtn key="d" icon={icons.trash} title="Supprimer" danger onClick={() => setDeleteTarget(row)} />,
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
            <IconBtn key="d" icon={icons.trash} title="Supprimer" danger onClick={() => setDeleteTarget({ ...row, _isWinner: true })} />,
          ]}
        />
      )}

      {/* Detail Modal */}
      {selected && !showForm && (
        <Modal title={selected.title || "Détails"} onClose={() => setSelected(null)}>
          {Object.entries(selected)
            .filter(([k]) => k !== "_isWinner")
            .map(([k, v]) => {
              if (k === "is_active")
                return <DetailRow key={k} label="Statut" value={v ? "Actif" : "Terminé"} />;
              return <DetailRow key={k} label={k.replace(/_/g, " ")} value={v} />;
            })}

          {!showWinners && (
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "space-between", flexWrap: "wrap" }}>
              <Btn
                variant={selected.is_active ? "danger" : "primary"}
                onClick={() => { handleToggleActive(selected); setSelected(null); }}
              >
                {selected.is_active ? "Désactiver" : "Réactiver"}
              </Btn>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="danger" onClick={() => { setDeleteTarget(selected); setSelected(null); }}>
                  {icons.trash} Supprimer
                </Btn>
                <Btn variant="secondary" onClick={() => openEdit(selected)}>
                  {icons.edit} Modifier
                </Btn>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <Modal
          title={editing ? `Modifier — ${editing.title}` : "Nouveau concours"}
          onClose={() => { setEditing(null); setCreating(false); setForm(emptyConcours); }}
        >
          <FormField label="Titre du concours *">
            <input
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
              placeholder="Ex: Gagnez une Rolex Submariner"
              style={inputStyle}
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="Description du concours..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: 80, lineHeight: 1.7 }}
            />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Nom du prix">
              <input
                value={form.prize_name}
                onChange={(e) => updateForm("prize_name", e.target.value)}
                placeholder="Ex: Rolex Submariner"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Valeur du prix">
              <input
                value={form.prize_value}
                onChange={(e) => updateForm("prize_value", e.target.value)}
                placeholder="Ex: 9.500€"
                style={inputStyle}
              />
            </FormField>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Date de fin">
              <input
                type="datetime-local"
                value={form.end_date ? form.end_date.slice(0, 16) : ""}
                onChange={(e) => updateForm("end_date", e.target.value ? new Date(e.target.value).toISOString() : "")}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Prix / mois (€)">
              <input
                type="number"
                value={form.price_per_month}
                onChange={(e) => updateForm("price_per_month", e.target.value)}
                min="0"
                step="0.01"
                style={inputStyle}
              />
            </FormField>
          </div>

          <FormField label="Image du prix (URL)">
            <input
              value={form.prize_image_url}
              onChange={(e) => updateForm("prize_image_url", e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </FormField>

          <FormField label="Image de fond (URL)">
            <input
              value={form.background_image_url}
              onChange={(e) => updateForm("background_image_url", e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </FormField>

          {/* Active toggle */}
          <div
            style={{
              padding: "14px 18px",
              background: theme.surface2,
              borderRadius: 16,
              border: `1px solid ${theme.border}`,
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Concours actif</div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
                Visible dans l'app mobile
              </div>
            </div>
            <button
              onClick={() => updateForm("is_active", !form.is_active)}
              style={{
                width: 48,
                height: 28,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: form.is_active
                  ? `linear-gradient(135deg, ${theme.goldLight}, ${theme.gold})`
                  : "rgba(255,255,255,0.08)",
                position: "relative",
                transition: "background .24s ease",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: form.is_active ? "#050505" : "rgba(255,255,255,0.5)",
                  position: "absolute",
                  top: 3,
                  left: form.is_active ? 23 : 3,
                  transition: "left .24s ease, background .24s ease",
                }}
              />
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => { setEditing(null); setCreating(false); setForm(emptyConcours); }}>
              Annuler
            </Btn>
            <Btn variant="primary" onClick={handleSave} disabled={saving || !form.title}>
              {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Créer le concours"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Supprimer "${deleteTarget.title}" ? Cette action est irréversible.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
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

function NotificationsPage({ data }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const profiles = data.profiles || [];
  const tokensCount = profiles.filter(
    (p) => p.expo_push_token && p.expo_push_token.startsWith("ExponentPushToken")
  ).length;

  // Load notification history
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetchData("notifications_history", {
        order: "sent_at.desc",
        limit: 20,
      });
      setHistory(res.data || []);
    } catch (err) {
      console.error("Erreur chargement historique:", err);
    }
    setLoadingHistory(false);
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), target: "all" }),
      });

      const data = await res.json();

      if (data.error && data.recipients === 0) {
        setResult({ type: "warning", message: data.error });
      } else if (data.error) {
        setResult({ type: "error", message: data.error });
      } else {
        setResult({
          type: "success",
          message: `Envoyé à ${data.delivered}/${data.recipients} utilisateurs${
            data.failed > 0 ? ` (${data.failed} échecs)` : ""
          }`,
        });
        setTitle("");
        setBody("");
        await loadHistory();
      }
    } catch (err) {
      setResult({ type: "error", message: "Erreur réseau" });
    }

    setSending(false);
  };

  const charLimit = 178;
  const bodyLength = body.length;

  return (
    <div>
      {/* Compose Section */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Left: Compose Form */}
        <div style={{ flex: "1 1 420px", minWidth: 320 }}>
          <div
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.005))",
              borderRadius: 24,
              border: `1px solid ${theme.border}`,
              padding: 24,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: theme.accentSoft,
                  border: `1px solid ${theme.accentBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.accent,
                  flexShrink: 0,
                }}
              >
                {icons.notif}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
                  Nouvelle notification
                </h3>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
                  Envoi à tous les utilisateurs via Expo Push
                </div>
              </div>
            </div>

            <FormField label="Titre">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Nouvel event exclusif ce week-end"
                maxLength={65}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Message">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Écris le contenu de la notification..."
                rows={4}
                maxLength={charLimit}
                style={{ ...inputStyle, resize: "vertical", minHeight: 100, lineHeight: 1.7 }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 6,
                  fontSize: 10,
                  color: bodyLength > charLimit * 0.9 ? "#C86A6A" : theme.textGhost,
                  fontFamily: fontMono,
                }}
              >
                {bodyLength}/{charLimit}
              </div>
            </FormField>

            {/* Token count info */}
            <div
              style={{
                padding: "12px 16px",
                background: theme.surface2,
                borderRadius: 14,
                border: `1px solid ${theme.border}`,
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: tokensCount > 0 ? theme.success : theme.danger }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  {tokensCount > 0 ? (
                    <polyline points="8,12 11,15 16,9" />
                  ) : (
                    <>
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </>
                  )}
                </svg>
              </span>
              <span style={{ fontSize: 12, color: theme.textSoft }}>
                <strong style={{ color: theme.text }}>{tokensCount}</strong> appareil{tokensCount !== 1 ? "s" : ""} enregistré{tokensCount !== 1 ? "s" : ""}
                {tokensCount === 0 && (
                  <span style={{ color: theme.textMuted }}>
                    {" "}— les utilisateurs doivent ouvrir l'app pour s'enregistrer
                  </span>
                )}
              </span>
            </div>

            {/* Result feedback */}
            {result && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 14,
                  marginBottom: 18,
                  fontSize: 12,
                  fontWeight: 500,
                  background:
                    result.type === "success"
                      ? theme.successSoft
                      : result.type === "warning"
                      ? theme.accentSoft
                      : theme.dangerSoft,
                  color:
                    result.type === "success"
                      ? "#CFE7CF"
                      : result.type === "warning"
                      ? theme.goldLight
                      : "#E6B0B0",
                  border: `1px solid ${
                    result.type === "success"
                      ? "rgba(143,191,143,0.22)"
                      : result.type === "warning"
                      ? theme.accentBorder
                      : "rgba(200,106,106,0.22)"
                  }`,
                }}
              >
                {result.message}
              </div>
            )}

            <Btn
              variant="primary"
              onClick={handleSend}
              disabled={sending || !title.trim() || !body.trim() || tokensCount === 0}
              style={{ width: "100%" }}
            >
              {sending ? (
                <>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(5,5,5,0.2)",
                      borderTopColor: "#050505",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Envoi en cours...
                </>
              ) : (
                <>
                  {icons.plane}
                  Envoyer à tous ({tokensCount})
                </>
              )}
            </Btn>
          </div>
        </div>

        {/* Right: Phone Preview */}
        <div style={{ flex: "0 0 280px" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: theme.textGhost,
              marginBottom: 10,
            }}
          >
            Aperçu
          </div>

          <div
            style={{
              background: "#1C1C1E",
              borderRadius: 24,
              padding: "16px 14px",
              border: `1px solid ${theme.border}`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            {/* Mock notification */}
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "12px 14px",
                backdropFilter: "blur(20px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    background: `linear-gradient(135deg, ${theme.goldLight}, ${theme.gold})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 7,
                    fontWeight: 800,
                    color: "#050505",
                  }}
                >
                  JA
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }}>
                  Just Agency
                </span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>
                  maintenant
                </span>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", marginBottom: 3, lineHeight: 1.3 }}>
                {title || "Titre de la notification"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
                {body || "Le contenu du message apparaîtra ici..."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div style={{ marginTop: 36 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
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
              Historique
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
              Notifications envoyées
            </h3>
          </div>
          <Btn variant="secondary" onClick={loadHistory}>
            {icons.refresh}
            Actualiser
          </Btn>
        </div>

        {loadingHistory ? (
          <div style={{ textAlign: "center", padding: 40, color: theme.textMuted, fontSize: 13 }}>
            Chargement...
          </div>
        ) : history.length === 0 ? (
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
            Aucune notification envoyée
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((n) => (
              <div
                key={n.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "16px 18px",
                  background: theme.surface,
                  borderRadius: 18,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <span style={{ color: theme.accent, marginTop: 2, flexShrink: 0 }}>{icons.notif}</span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 2 }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.6 }}>
                    {n.body}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <Badge color="info">{n.recipients_count} envoyé{n.recipients_count > 1 ? "s" : ""}</Badge>
                    {n.success_count > 0 && <Badge color="success">{n.success_count} reçu{n.success_count > 1 ? "s" : ""}</Badge>}
                    {n.failure_count > 0 && <Badge color="danger">{n.failure_count} échec{n.failure_count > 1 ? "s" : ""}</Badge>}
                  </div>
                </div>

                <span style={{ fontSize: 11, color: theme.textGhost, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {timeAgo(n.sent_at)}
                </span>
              </div>
            ))}
          </div>
        )}
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
              {page === "profiles" && <ProfilesPage data={data} onRefresh={loadData} />}
              {page === "demandes" && <DemandesPage data={data} onRefresh={loadData} />}
              {page === "events" && <EventsPage data={data} onRefresh={loadData} />}
              {page === "concours" && <ConcoursPage data={data} onRefresh={loadData} />}
              {page === "map" && <MapPage data={data} />}
              {page === "notifications" && <NotificationsPage data={data} />}
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