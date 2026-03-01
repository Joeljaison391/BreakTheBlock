import { inngest } from "./client";

// Background worker task for processing new group creations
export const processGroupInvite = inngest.createFunction(
    { id: "process-group-invite", name: "Process Group Invite" },
    { event: "app/group.created" },
    async ({ event, step }) => {

        // Step 1: Initialize the async block
        await step.run("recalculate-region-stats", async () => {
            // Background DB update logic goes here
            // e.g. updating the region's total score based on the new group
            return { success: true, groupId: event.data.groupId };
        });

        // Step 2: Notify friends or matching users
        await step.run("notify-users", async () => {
            // Send push notifications or email background tasks
            return { notified: true, admin: event.data.adminId };
        });

        return { event, body: "Group processing complete." };
    }
);
