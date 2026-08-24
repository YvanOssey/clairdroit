import type { Express, Request, Response, NextFunction } from "express";

/**
 * Keeps unknown API requests in the API layer. Without this fallback,
 * development's catch-all HTML handler can return index.html to a tRPC client.
 */
export function registerApiFallback(app: Express) {
  app.use("/api", (_req: Request, res: Response, _next: NextFunction) => {
    if (res.headersSent) return;
    res.status(404).json({ error: "API route not found" });
  });
}
