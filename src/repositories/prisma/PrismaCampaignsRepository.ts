import { prisma } from "../../database";
import { AddLeadToCampaignAttributes, CampaignsRepository, CampaingModel, CreateCampignAttributes } from "../CampaignsRepository";

export class PrismaCampaignsRepository implements CampaignsRepository {
  find(): Promise<CampaingModel[]> {
    return prisma.campaign.findMany()
  }

  findById(id: number): Promise<CampaingModel | null> {
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

  create(attributes: CreateCampignAttributes): Promise<CampaingModel> {
    return prisma.campaign.create({ data: attributes })
  }

  async updateById(id: number, attributes: Partial<CreateCampignAttributes>): Promise<CampaingModel | null> {
    const campaignExists = await prisma.campaign.findUnique({ where: { id } })
    if (!campaignExists) return null
    return prisma.campaign.update({
      where: { id },
      data: attributes
    })

  }

  async deleteById(id: number): Promise<CampaingModel | null> {
    const campaignExists = prisma.campaign.findUnique({ where: { id } })
    if (!campaignExists) return null
    return prisma.campaign.delete({ where: { id } })
  }

  async addLead(attributes: AddLeadToCampaignAttributes): Promise<void>{
    await prisma.leadCampaign.create({ data: attributes })
  }

  async updateLeadStatus(attributes: AddLeadToCampaignAttributes): Promise<void> {
    await prisma.leadCampaign.update({ 
      data: attributes,
      where: {
        leadId_campaignId: attributes
      }        
    })
  }

  async removeLead(campaignId: number, leadId: number): Promise<void> {
    await prisma.leadCampaign.delete({
      where: {
        leadId_campaignId: { campaignId, leadId }
      }
    })
  }
}