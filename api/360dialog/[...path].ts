import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join("/") : path || "";
  const targetUrl = `https://waba-sandbox.360dialog.io/v1/${pathString}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: req.body,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error" });
  }
}
