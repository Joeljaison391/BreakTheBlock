import { Inngest, EventSchemas } from "inngest";

// Define the payload for your events to ensure type safety across the app
type Events = {
    "app/group.created": {
        data: {
            groupId: string;
            adminId: string;
        };
    };
    "app/goal.completed": {
        data: {
            goalId: string;
            userId: string;
            proofUrl?: string;
        };
    };
};

// Initialize Inngest with strict event schemas
export const inngest = new Inngest({
    id: "break-the-block",
    schemas: new EventSchemas().fromRecord<Events>()
});
