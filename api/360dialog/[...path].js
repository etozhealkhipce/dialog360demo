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
    const headers = {
      "Content-Type": "application/json",
    };

    if (req.headers["d360-api-key"]) {
      headers["D360-Api-Key"] = req.headers["d360-api-key"];
    }
    if (req.headers.authorization) {
      headers["Authorization"] = req.headers.authorization;
    }

    const response = await fetch(targetUrl, {
      headers,
      method: req.method,
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy error" });
  }
};
