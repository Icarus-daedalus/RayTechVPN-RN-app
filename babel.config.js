module.exports = function (api) {
  // #region agent log
  const agentLog = (hypothesisId, message, data) =>
    fetch("http://127.0.0.1:7582/ingest/24149516-938f-4712-a318-861f4a668105", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1fc118" },
      body: JSON.stringify({
        sessionId: "1fc118",
        runId: "pre-fix",
        hypothesisId,
        location: "babel.config.js:1",
        message,
        data,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  // #endregion

  // #region agent log
  agentLog("H3", "babel-config-loaded", {
    cwd: process.cwd(),
    nodeVersion: process.version,
  });
  // #endregion

  // #region agent log
  let presetResolvedPath = null;
  let presetResolveError = null;
  try {
    presetResolvedPath = require.resolve("babel-preset-expo");
  } catch (error) {
    presetResolveError = error instanceof Error ? error.message : String(error);
  }
  agentLog("H1", "babel-preset-expo-resolve-check", {
    presetResolvedPath,
    presetResolveError,
  });
  // #endregion

  // #region agent log
  let expoResolvedPath = null;
  let expoResolveError = null;
  try {
    expoResolvedPath = require.resolve("expo/package.json");
  } catch (error) {
    expoResolveError = error instanceof Error ? error.message : String(error);
  }
  agentLog("H2", "expo-package-resolve-check", {
    expoResolvedPath,
    expoResolveError,
  });
  // #endregion

  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./src",
          },
          extensions: [".ios.ts", ".android.ts", ".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
    ],
  };
};