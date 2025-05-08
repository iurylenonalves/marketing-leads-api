import { CampaignsService } from '../CampaignsService'
import { CreateCampaignAttributes } from '../../repositories/CampaignsRepository'


const mockCampaignsRepository: any = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
}

describe('CampaignsService', () => {
  let service: CampaignsService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new CampaignsService(mockCampaignsRepository)
  })

  it('should paginate and return campaigns', async () => {
    const campaigns = [{ id: 1, name: 'Campaign', description: '', startDate: new Date(), endDate: null }]
    mockCampaignsRepository.find.mockResolvedValue(campaigns)
    const result = await service.getAllCampaigns({ page: 1, pageSize: 10 })
    expect(result.campaigns).toEqual(campaigns)
    expect(result.meta.total).toBe(1)
    expect(result.meta.totalPages).toBe(1)
  })

  it('should paginate and return campaigns with default params', async () => {
    const campaigns = [{ id: 1, name: 'Campaign', description: '', startDate: new Date(), endDate: null }]
    mockCampaignsRepository.find.mockResolvedValue(campaigns)
    const result = await service.getAllCampaigns()
    expect(result.campaigns).toEqual(campaigns)
    expect(result.meta.page).toBe(1)
    expect(result.meta.pageSize).toBe(10)
  })

  it('should create a new campaign', async () => {
    const params: CreateCampaignAttributes = { name: 'New', description: 'desc', startDate: new Date() }
    const created = { id: 1, ...params, endDate: null }
    mockCampaignsRepository.create.mockResolvedValue(created)
    const result = await service.createCampaign(params)
    expect(result).toEqual(created)
    expect(mockCampaignsRepository.create).toHaveBeenCalledWith(params)
  })

  it('should show a campaign if found', async () => {
    const campaign = { id: 1, name: 'Campaign', description: '', startDate: new Date(), endDate: null }
    mockCampaignsRepository.findById.mockResolvedValue(campaign)
    const result = await service.showCampaign(1)
    expect(result).toBe(campaign)
  })

  it('should throw error if campaign not found on show', async () => {
    mockCampaignsRepository.findById.mockResolvedValue(null)
    await expect(service.showCampaign(999)).rejects.toThrow('campaign not found')
  })

  it('should update a campaign', async () => {
    const campaign = { id: 1, name: 'Campaign', description: '', startDate: new Date(), endDate: null }
    const updated = { ...campaign, name: 'Updated' }
    mockCampaignsRepository.findById.mockResolvedValue(campaign)
    mockCampaignsRepository.updateById.mockResolvedValue(updated)
    const result = await service.updateCampaign(1, { name: 'Updated' })
    expect(result).toEqual(updated)
  })

  it('should throw error if campaign not found on update', async () => {
    mockCampaignsRepository.findById.mockResolvedValue(null)
    await expect(service.updateCampaign(999, { name: 'X' })).rejects.toThrow('campaign not found')
  })

  it('should delete a campaign', async () => {
    const campaign = { id: 1, name: 'Campaign', description: '', startDate: new Date(), endDate: null }
    mockCampaignsRepository.findById.mockResolvedValue(campaign)
    mockCampaignsRepository.deleteById.mockResolvedValue(campaign)
    const result = await service.deleteCampaign(1)
    expect(result).toBe(campaign)
    expect(mockCampaignsRepository.deleteById).toHaveBeenCalledWith(1)
  })

  it('should throw error if campaign not found on delete', async () => {
    mockCampaignsRepository.findById.mockResolvedValue(null)
    await expect(service.deleteCampaign(999)).rejects.toThrow('campaign not found')
  })
})