import { serve } from "inngest/next";
import { inngest } from "./client";
import { processGroupInvite } from "./functions";

// Serve the Inngest API
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        processGroupInvite,
    ],
});
