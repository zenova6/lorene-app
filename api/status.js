export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch("http://51.75.118.79:20175/status", {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(503).json({
      status: "offline",
      uptime: 0,
      servers: 0,
      ping: 0,
    });
  }
}