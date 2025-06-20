module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, D360-Api-Key",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join("/") : path || "";
  const targetUrl = `https://waba-sandbox.360dialog.io/v1/${pathString}`;

  try {
    const headers = {};

    Object.keys(req.headers).forEach((key) => {
      if (key.toLowerCase() !== "host") {
        headers[key] = req.headers[key];
      }
    });

    let body = req.body;

    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      body = req.body;
    } else if (req.method !== "GET" && req.body) {
      body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, {
      headers,
      method: req.method,
      body: req.method !== "GET" ? body : undefined,
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", contentType || "application/octet-stream");
      res.setHeader("Content-Length", buffer.byteLength);
      res.status(response.status).send(Buffer.from(buffer));
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy error" });
  }
};
