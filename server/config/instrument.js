import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://de520f6ac130fb3ebbc5b25418e0a04d@o4509736242315264.ingest.us.sentry.io/4509736247558144",

  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],

//   tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  sendDefaultPii: true,
});
