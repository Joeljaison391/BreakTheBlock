// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://3b7180b7e7d3d8bd3f48e6b92a2dcbe4@o4510969614368768.ingest.de.sentry.io/4510969617711184",

  // Replay may trigger privacy concerns if not configured carefully. 
  // Let's stick with error traces per standard instructions unless needed
  tracesSampleRate: 1,
  debug: false,
  enableLogs: true,
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
