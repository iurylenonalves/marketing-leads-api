export interface CampaignModel {
  id: number
  name: string
  description: string
  startDate: Date
  endDate: Date | null
}

export type LeadCampaignStatus = 
  "New" | "Engaged" | "FollowUp_Scheduled" | "Contacted" | "Qualified" | 
  "Converted" | "Unresponsive" | "Disqualified" | "Re_Engaged" | "Opted_Out"

export interface CreateCampaignAttributes {
  name: string
  description: string
  startDate: Date
  endDate?: Date
}

export interface AddLeadToCampaignAttributes {
  campaignId: number
  leadId: number
  status: LeadCampaignStatus
}

export interface FindOptions {
  limit?: number
  offset?: number
}

export interface CampaignsRepository {
  find: () => Promise<CampaignModel[]>
  findById: (id: number) => Promise<CampaignModel | null>
  create: (attributes: CreateCampaignAttributes) => Promise<CampaignModel>
  updateById: (id: number, attributes: Partial<CreateCampaignAttributes>) => Promise<CampaignModel | null>
  deleteById: (id: number) => Promise<CampaignModel | null>
  addLead: (attributes: AddLeadToCampaignAttributes) => Promise<void>
  updateLeadStatus: (attributes: AddLeadToCampaignAttributes) => Promise<void>
  removeLead: (campaignId: number, leadId: number) => Promise<void>
  exists: (id: number) => Promise<boolean>
  getLeadInCampaign: (campaignId: number, leadId: number) => Promise<any | null>
}