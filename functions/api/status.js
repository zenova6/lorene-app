export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(
      "https://tp-db-9ab01-default-rtdb.firebaseio.com/bot-status.json"
    );
    const data = await res.json();

    const isStale = Date.now() - data.lastSeen > 60000;
    if (isStale) throw new Error("stale");

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders,
    });
  } catch {
    return new Response(
      JSON.stringify({ status: "offline", uptime: 0, servers: 0, ping: 0 }),
      { status: 503, headers: corsHeaders }
    );
  }
}