export interface CampaingModel {
  id: number
  name: string
  description: string
  startDate: Date
  endDate: Date | null
}

export type LeadCampignStatus = 
  "New" | "Engaged" | "FollowUp_Scheduled" | "Contacted" | "Qualified" | 
  "Converted" | "Unresponsive" | "Disqualified" | "Re_Engaged" | "Opted_Out"

export interface CreateCampignAttributes {
  name: string
  description: string
  startDate: Date
  endDate?: Date
}

export type LeadCampaignStatus = 
 "New" | "Engaged" | "FollowUp_Scheduled" | "Contacted" | "Qualified" | 
 "Converted" | "Unresponsive" | "Disqualified" | "Re_Engaged" | "Opted_Out"

export interface AddLeadToCampaignAttributes {
  campaignId: number
  leadId: number
  status: LeadCampignStatus
}

export interface CampaignsRepository {
  find: () => Promise<CampaingModel[]>
  findById: (id: number) => Promise<CampaingModel | null>
  create: (attributes: CreateCampignAttributes) => Promise<CampaingModel>
  updateById: (id: number, attributes: Partial<CreateCampignAttributes>) => Promise<CampaingModel | null>
  deleteById: (id: number) => Promise<CampaingModel | null>
  addLead: (attributes: AddLeadToCampaignAttributes) => Promise<void>
  updateLeadStatus: (attributes: AddLeadToCampaignAttributes) => Promise<void>
  removeLead: (campaignId: number, leadId: number) => Promise<void>
}