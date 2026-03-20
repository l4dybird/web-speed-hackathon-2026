declare global {
  var __BUILD_INFO__: {
    BUILD_DATE: string | undefined;
    COMMIT_HASH: string | undefined;
    PR_CANARY: string;
  };
}

/** @note 競技用サーバーで参照します。可能な限りコード内に含めてください */
window.__BUILD_INFO__ = {
  BUILD_DATE: process.env["BUILD_DATE"],
  COMMIT_HASH: process.env["COMMIT_HASH"],
  PR_CANARY: "PR212-CANARY-20260320-A1",
};

export {};
