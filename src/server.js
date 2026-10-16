import http from "node:http";
import pg from "pg";

const port = Number(process.env.PORT ?? 3000);
const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 3000 })
  : null;

async function dbStatus() {
  if (!pool) return "not configured";
  try {
    await pool.query("select 1");
    return "connected";
  } catch {
    return "unreachable";
  }
}

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(json) });
  res.end(json);
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, { error: "method not allowed" });
  if (pathname === "/") return send(res, 200, { name: "node-api-postgres", ok: true });
  if (pathname === "/health") {
    const database = await dbStatus();
    return send(res, database === "unreachable" ? 503 : 200, { ok: true, database });
  }
  return send(res, 404, { error: "not found" });
});

server.listen(port, "0.0.0.0", () => console.log(`listening on :${port}`));

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => pool?.end().finally(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
