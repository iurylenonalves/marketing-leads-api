import { HttpError } from "../errors/HttpError";
import { CampaignsRepository, CreateCampaignAttributes } from "../repositories/CampaignsRepository";

interface GetAllCampaignsParams {
  page?: number;
  pageSize?: number;
}

export class CampaignsService {
  constructor(private readonly campaignsRepository: CampaignsRepository) { }

  async getAllCampaigns(params?: GetAllCampaignsParams) {
    const { page = 1, pageSize = 10 } = params || {};
    
    const allCampaigns = await this.campaignsRepository.find();
    const total = allCampaigns.length;
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const campaigns = allCampaigns.slice(startIndex, endIndex);
    
    return {
      campaigns,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      },
    };
  }

  async createCampaign(params: CreateCampaignAttributes) {
    const newCampaign = await this.campaignsRepository.create(params)
    return newCampaign
  }

  async showCampaign(id: number) {
    const campaign = await this.campaignsRepository.findById(id)
    if (!campaign) throw new HttpError(404, "campaign not found")
    return campaign
  }

  async updateCampaign(id: number, params: Partial<CreateCampaignAttributes>) {
    const campaign = await this.campaignsRepository.findById(id)
    if (!campaign) throw new HttpError(404, "campaign not found")
    const updatedCampaign = await this.campaignsRepository.updateById(id, params)
    return updatedCampaign
  }

  async deleteCampaign(id: number) {
    const campaign = await this.campaignsRepository.findById(id)
    if (!campaign) throw new HttpError(404, "campaign not found")
    await this.campaignsRepository.deleteById(id)
    return campaign
  }
}