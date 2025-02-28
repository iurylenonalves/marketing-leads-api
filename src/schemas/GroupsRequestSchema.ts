import { z } from "zod";

export const CreateGroupsRequestSchema = z.object({
  name: z.string(),
  description: z.string()
})