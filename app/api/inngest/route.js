import { serve } from "inngest/next";

import {
  inngest,
  createUserOrder,
  syncUserCart,
  syncUserUpdation,
  syncUserDeletion,
} from "@/config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCart,
    syncUserUpdation,
    syncUserDeletion,
    createUserOrder,
  ],
});