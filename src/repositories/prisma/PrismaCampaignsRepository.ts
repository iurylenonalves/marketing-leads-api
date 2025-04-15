import { prisma } from "../../database";
import { AddLeadToCampaignAttributes, CampaignsRepository, CampaignModel, CreateCampaignAttributes } from "../CampaignsRepository";

export class PrismaCampaignsRepository implements CampaignsRepository {
  find(): Promise<CampaignModel[]> {
    return prisma.campaign.findMany()
  }

  findById(id: number): Promise<CampaignModel | null> {
    return prisma.campaign.findUnique({
      where: { id },
      include: {
        leads: {
          include: {
            lead: true
          }
        }
      }
    })
  }

  create(attributes: CreateCampaignAttributes): Promise<CampaignModel> {
    return prisma.campaign.create({ data: attributes })
  }

  async updateById(id: number, attributes: Partial<CreateCampaignAttributes>): Promise<CampaignModel | null> {
    const campaignExists = await prisma.campaign.findUnique({ where: { id } })
    if (!campaignExists) return null
    return prisma.campaign.update({
      where: { id },
      data: attributes
    })

  }

  async deleteById(id: number): Promise<CampaignModel | null> {
    const campaignExists = await prisma.campaign.findUnique({ where: { id } })
    if (!campaignExists) return null
    return prisma.campaign.delete({ where: { id } })
  }

  async addLead(attributes: AddLeadToCampaignAttributes): Promise<void>{
    await prisma.leadCampaign.create({ data: attributes })
  }

  async updateLeadStatus(attributes: AddLeadToCampaignAttributes): Promise<void> {
    const { campaignId, leadId, status } = attributes;
  
    await prisma.leadCampaign.update({
      where: {
        leadId_campaignId: {
          campaignId,
          leadId
        }
      },
      data: {
        status
      }
    });
  }

  async removeLead(campaignId: number, leadId: number): Promise<void> {
    await prisma.leadCampaign.delete({
      where: {
        leadId_campaignId: { campaignId, leadId }
      }
    })
  }
  
  async exists(id: number): Promise<boolean> {
    const count = await prisma.campaign.count({
      where: { id }
    });
    return count > 0;
  }

  async getLeadInCampaign(campaignId: number, leadId: number): Promise<any | null> {
    return prisma.leadCampaign.findUnique({
      where: {
        leadId_campaignId: { campaignId, leadId }
      }
    });
  }
}