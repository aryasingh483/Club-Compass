// import arcjet, { createMiddleware, detectBot, shield, fixedWindow } from "@arcjet/next";

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!_next/|api/|favicon.ico).*)"],
};

/*
const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  characteristics: ["ip.src"], // Track requests by IP
  rules: [
    // Shield protects against common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Detect bots
    detectBot({
      mode: "LIVE", // Block bots. Use "DRY_RUN" to log only
      // Allow search engine crawlers
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
        "CATEGORY:PREVIEW", // Allow social previews (Slack, Discord, etc)
        "CATEGORY:MONITOR" // Allow uptime monitors
      ],
    }),
    // Rate limit: 100 requests per hour per IP
    fixedWindow({
      mode: "LIVE",
      window: "1h",
      max: 100,
    }),
  ],
});
*/

// Pass existing middleware if you have one, or just use Arcjet
export default function middleware() {
  return;
}