import { z } from "zod";

export const createCampaignsRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional()
})

export const updateCampaignsRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
})

const LeadCampaignStatusSchema = z.enum([
  "New",
  "Engaged",
  "FollowUp_Scheduled",
  "Contacted",
  "Qualified",
  "Converted",
  "Unresponsive",
  "Disqualified",
  "Re_Engaged",
  "Opted_Out"
])

export const GetCampaignLeadsRequestSchema = z.object({
  page: z.string().optional().default("1").refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: "Invalid page" }),
  pageSize: z.string().optional().default("10").refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: "Invalid pageSize" }),
  name: z.string().optional(),
  status: LeadCampaignStatusSchema.optional(),
  sortBy: z.enum(["name", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional()
})

export const AddLeadRequestSchema = z.object({
  leadId: z.number(),
  status: LeadCampaignStatusSchema.optional()
})

export const UpdateLeadStatusRequestSchema = z.object({
  status: LeadCampaignStatusSchema
})