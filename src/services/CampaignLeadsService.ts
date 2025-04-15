import { HttpError } from "../errors/HttpError";
import { CampaignsRepository, LeadCampaignStatus } from "../repositories/CampaignsRepository";
import { LeadsRepository, LeadWhereParams } from "../repositories/LeadsRepository";

interface GetLeadsParams {
  campaignId: number;
  page?: number;
  pageSize?: number;
  name?: string;
  status?: LeadCampaignStatus;
  sortBy?: "name" | "status" | "createdAt"
  order?: 'asc' | 'desc';
}

export class CampaignLeadsService {
  constructor(
    private readonly campaignsRepository: CampaignsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}

  async getLeads(params: GetLeadsParams) {
    const { 
      campaignId,
      page = 1, 
      pageSize = 10, 
      name, 
      status, 
      sortBy = "name", 
      order = "asc" 
    } = params;

    const limit = pageSize;
    const offset = (page - 1) * limit;

    const where: LeadWhereParams = { 
      campaignId,
      campaignStatus: status 
    };

    if (name) where.name = { like: name, mode: "insensitive" };

    const leads = await this.leadsRepository.find({
      where,
      sortBy,
      order,
      limit,
      offset,
      include: { campaigns: true }
    });

    const total = await this.leadsRepository.count(where);

    return {
      leads,
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async addLead(campaignId: number, leadId: number, status: LeadCampaignStatus = "New") {
    const campaignExists = await this.campaignsRepository.exists(campaignId);
    const leadExists = await this.leadsRepository.exists(leadId);
  
    if (!campaignExists || !leadExists) {
      throw new HttpError(404, "Campaign or lead not found");
  }
  
    const existing = await this.campaignsRepository.getLeadInCampaign(campaignId, leadId);
    if (existing) {
      throw new HttpError(409, "Lead is already in this campaign");
  }
    
    await this.campaignsRepository.addLead({ 
      campaignId, 
      leadId, 
      status 
    });
  }

  async updateLeadStatus(campaignId: number, leadId: number, status: LeadCampaignStatus) {   
    const relationship = await this.campaignsRepository.getLeadInCampaign(campaignId, leadId);
  
    if (!relationship) {
      throw new HttpError(404, "Lead is not associated with this campaign");
  }
  
    await this.campaignsRepository.updateLeadStatus({ 
      campaignId, 
      leadId, 
      status 
    });
  }

  async removeLead(campaignId: number, leadId: number) {
    const relationship = await this.campaignsRepository.getLeadInCampaign(campaignId, leadId)
  
    if (!relationship) {
      throw new HttpError(404, "Lead is not associated with this campaign")
   }
  
    await this.campaignsRepository.removeLead(campaignId, leadId)
  
  }
}