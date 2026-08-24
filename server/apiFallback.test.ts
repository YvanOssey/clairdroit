import express from "express";
import { createServer, get, type IncomingMessage } from "node:http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { initTRPC } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { registerApiFallback } from "./_core/apiFallback";

function request(server: ReturnType<typeof createServer>, path: string) {
  return new Promise<{
    status: number;
    contentType: string | undefined;
    body: string;
  }>((resolve, reject) => {
    const address = server.address();
    if (!address || typeof address === "string") {
      reject(new Error("Test server has no address"));
      return;
    }

    const req = get(
      {
        hostname: "127.0.0.1",
        port: address.port,
        path,
      },
      (res: IncomingMessage) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", chunk => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 0,
            contentType: res.headers["content-type"],
            body,
          });
        });
      },
    );
    req.on("error", reject);
  });
}

const t = initTRPC.create();
const testRouter = t.router({
  site: t.router({
    settings: t.procedure.query(() => ({ siteName: "ClairDroit" })),
  }),
});

describe("API fallback", () => {
  it("renvoie du JSON pour une route API inconnue", async () => {
    const app = express();
    registerApiFallback(app);
    const server = createServer(app);

    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", () => resolve()));
    try {
      const response = await request(server, "/api/not-found");
      expect(response.status).toBe(404);
      expect(response.contentType).toContain("application/json");
      expect(response.body).not.toContain("<!doctype");
      expect(JSON.parse(response.body)).toEqual({ error: "API route not found" });
    } finally {
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
  });

  it("renvoie du JSON pour site.settings avant le fallback HTML", async () => {
    const app = express();
    app.use(
      "/api/trpc",
      createExpressMiddleware({
        router: testRouter,
        createContext: () => ({}),
      }),
    );
    registerApiFallback(app);
    app.use("*", (_req, res) => {
      res.type("html").send("<!doctype html><html><body>app</body></html>");
    });
    const server = createServer(app);

    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", () => resolve()));
    try {
      const response = await request(server, "/api/trpc/site.settings");
      expect(response.status).toBe(200);
      expect(response.contentType).toContain("application/json");
      expect(response.body).not.toContain("<!doctype html>");
      expect(JSON.parse(response.body)).toMatchObject({
        result: { data: { siteName: "ClairDroit" } },
      });
    } finally {
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
  });
});
