import { z } from "zod";

export const GetGroupsRequestSchema = z.object({
  name: z.string(),
  description: z.string()
})