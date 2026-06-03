// functions/api/status.js

export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
    "Content-Type": "application/json",
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch("http://51.75.118.79:20175/status", {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "offline", uptime: 0, servers: 0, ping: 0 }),
      { status: 503, headers: corsHeaders }
    );
  }
}
