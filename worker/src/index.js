const TTL_MS = 45_000;
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...CORS },
  });
}

export class PitRoom {
  constructor(state) {
    this.state = state;
  }

  async people() {
    return (await this.state.storage.get("people")) || {};
  }

  async prune(map) {
    const now = Date.now();
    let changed = false;
    for (const id of Object.keys(map)) {
      if (now - (map[id].last || 0) > TTL_MS) {
        delete map[id];
        changed = true;
      }
    }
    if (changed) await this.state.storage.put("people", map);
    return map;
  }

  list(map) {
    const people = Object.values(map)
      .sort((a, b) => (b.last || 0) - (a.last || 0))
      .map((p) => ({
        id: p.id,
        name: p.name || "anonymous",
        status: p.status || "signed in",
        wallet: p.wallet ? p.wallet.slice(0, 6) + "…" + p.wallet.slice(-4) : null,
      }));
    return { count: people.length, people };
  }

  async fetch(req) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

    let map = await this.prune(await this.people());

    if (req.method === "GET") return json(this.list(map));

    if (req.method === "POST") {
      let body = {};
      try { body = await req.json(); } catch (e) {}
      const id = String(body.id || "").slice(0, 80);
      if (!id) return json({ error: "need id" }, 400);
      map[id] = {
        id,
        name: String(body.name || "anonymous").slice(0, 32),
        status: String(body.status || "signed in").slice(0, 80),
        wallet: body.wallet ? String(body.wallet).slice(0, 80) : null,
        last: Date.now(),
      };
      await this.state.storage.put("people", map);
      return json(this.list(map));
    }

    return json({ error: "no" }, 405);
  }
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

    const url = new URL(req.url);
    if (url.pathname === "/health") return json({ ok: true, service: "signed-in-pit" });

    let pair = url.searchParams.get("pair") || "";
    if (req.method === "POST") {
      try {
        const clone = req.clone();
        const body = await clone.json();
        pair = body.pair || pair;
      } catch (e) {}
    }
    pair = String(pair || "lobby").slice(0, 120);
    const id = env.PIT.idFromName(pair);
    return env.PIT.get(id).fetch(req);
  },
};
