import { z } from "zod";

const LeadStatusSchema = z.enum([
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Unresponsive",
  "Disqualified",
  "Archived",
])

export const GetLeadsRequestSchema = z.object({
  name: z.string().optional(),
  page: z.string().optional().default("1").refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: "Invalid page" }),
  pageSize: z.string().optional().default("10").refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: "Invalid pageSize" }),
  status: LeadStatusSchema.optional(),
  sortBy: z.enum(["name", "status", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional()
})

export const CreateLeadRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  status: LeadStatusSchema.optional()
})

export const UpdateLeadRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: LeadStatusSchema.optional()
})