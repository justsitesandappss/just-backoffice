import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

// Verify admin session
function isAuthed(request) {
  const session = request.cookies.get("just_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_TOKEN;
}

// Fetch all profiles with push tokens from Supabase
async function getTokens(target) {
  let url = `${SUPABASE_URL}/rest/v1/profiles?select=id,full_name,expo_push_token&expo_push_token=not.is.null`;

  if (target === "vip") {
    url += "&is_vip=eq.true";
  }

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Supabase error: ${res.status}`);
  }

  return res.json();
}

// Send push via Expo Push API (batches of 100)
async function sendExpoPush(tokens, title, body) {
  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    priority: "high",
  }));

  // Expo accepts max 100 per request
  const batches = [];
  for (let i = 0; i < messages.length; i += 100) {
    batches.push(messages.slice(i, i + 100));
  }

  let successCount = 0;
  let failureCount = 0;

  for (const batch of batches) {
    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(batch),
      });

      const result = await res.json();

      if (result.data) {
        result.data.forEach((r) => {
          if (r.status === "ok") successCount++;
          else failureCount++;
        });
      }
    } catch (err) {
      console.error("Expo push batch error:", err);
      failureCount += batch.length;
    }
  }

  return { successCount, failureCount };
}

// Log notification to history table
async function logNotification(title, body, target, recipientsCount, successCount, failureCount) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/notifications_history`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body,
        target,
        recipients_count: recipientsCount,
        success_count: successCount,
        failure_count: failureCount,
      }),
    });
  } catch (err) {
    console.error("Error logging notification:", err);
  }
}

export async function POST(request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { title, body, target = "all" } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: "Titre et message requis" },
        { status: 400 }
      );
    }

    // Get profiles with tokens
    const profiles = await getTokens(target);
    const tokens = profiles
      .map((p) => p.expo_push_token)
      .filter((t) => t && t.startsWith("ExponentPushToken"));

    if (tokens.length === 0) {
      return NextResponse.json(
        { error: "Aucun utilisateur avec un token push enregistré", recipients: 0 },
        { status: 200 }
      );
    }

    // Send
    const { successCount, failureCount } = await sendExpoPush(tokens, title, body);

    // Log
    await logNotification(title, body, target, tokens.length, successCount, failureCount);

    return NextResponse.json({
      success: true,
      recipients: tokens.length,
      delivered: successCount,
      failed: failureCount,
    });
  } catch (err) {
    console.error("Push API error:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}