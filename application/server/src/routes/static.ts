import path from "node:path";

import history from "connect-history-api-fallback";
import { Router } from "express";
import serveStatic, { type ServeStaticOptions } from "serve-static";

import {
  CLIENT_DIST_PATH,
  PUBLIC_PATH,
  UPLOAD_PATH,
} from "@web-speed-hackathon-2026/server/src/paths";

export const staticRouter = Router();

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const setCacheControl = (cacheControl: string): NonNullable<ServeStaticOptions["setHeaders"]> => {
  return (res) => {
    res.setHeader("Cache-Control", cacheControl);
  };
};

const setDistHeaders: NonNullable<ServeStaticOptions["setHeaders"]> = (res, filePath) => {
  if (path.basename(filePath) === "index.html") {
    res.setHeader("Cache-Control", "no-cache");
    return;
  }

  res.setHeader("Cache-Control", `public, max-age=${ONE_YEAR_IN_SECONDS}, immutable`);
};

// SPA 対応のため、ファイルが存在しないときに index.html を返す
staticRouter.use(history());

staticRouter.use(
  serveStatic(UPLOAD_PATH, {
    maxAge: `${ONE_YEAR_IN_SECONDS}s`,
    immutable: true,
    setHeaders: setCacheControl(`public, max-age=${ONE_YEAR_IN_SECONDS}, immutable`),
  }),
);

staticRouter.use(
  serveStatic(PUBLIC_PATH, {
    maxAge: `${ONE_DAY_IN_SECONDS}s`,
    setHeaders: setCacheControl(`public, max-age=${ONE_DAY_IN_SECONDS}`),
  }),
);

staticRouter.use(
  serveStatic(CLIENT_DIST_PATH, {
    setHeaders: setDistHeaders,
  }),
);
