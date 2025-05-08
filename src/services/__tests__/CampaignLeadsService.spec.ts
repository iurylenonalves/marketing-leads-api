import { CampaignLeadsService } from '../CampaignLeadsService'

const mockCampaignsRepository: any = {
  exists: jest.fn(),
  getLeadInCampaign: jest.fn(),
  addLead: jest.fn(),
  updateLeadStatus: jest.fn(),
  removeLead: jest.fn(),
}
const mockLeadsRepository: any = {
  exists: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
}

describe('CampaignLeadsService', () => {
  let service: CampaignLeadsService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new CampaignLeadsService(mockCampaignsRepository, mockLeadsRepository)
  })

  describe('getLeads', () => {
    it('should return paginated leads for a campaign', async () => {
      const leads = [{ id: 1, name: 'Lead', status: 'New' }]
      mockLeadsRepository.find.mockResolvedValue(leads)
      mockLeadsRepository.count.mockResolvedValue(1)
      const result = await service.getLeads({ campaignId: 1, page: 1, pageSize: 10 })
      expect(result.leads).toEqual(leads)
      expect(result.meta.total).toBe(1)
      expect(result.meta.page).toBe(1)
      expect(result.meta.pageSize).toBe(10)
    })

    it('should filter leads by name', async () => {
      const leads = [{ id: 1, name: 'Lead', status: 'New' }]
      mockLeadsRepository.find.mockResolvedValue(leads)
      mockLeadsRepository.count.mockResolvedValue(1)
      await service.getLeads({ campaignId: 1, name: 'Lead' })
      expect(mockLeadsRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ name: { like: 'Lead', mode: 'insensitive' } }) })
      )
    })

    it('should filter leads by status', async () => {
      const leads = [{ id: 1, name: 'Lead', status: 'New' }]
      mockLeadsRepository.find.mockResolvedValue(leads)
      mockLeadsRepository.count.mockResolvedValue(1)
      await service.getLeads({ campaignId: 1, status: 'New' })
      expect(mockLeadsRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ campaignStatus: 'New' }) })
      )
    })
  })

  describe('addLead', () => {
    it('should add a lead to a campaign', async () => {
      mockCampaignsRepository.exists.mockResolvedValue(true)
      mockLeadsRepository.exists.mockResolvedValue(true)
      mockCampaignsRepository.getLeadInCampaign.mockResolvedValue(null)
      mockCampaignsRepository.addLead.mockResolvedValue()
      await expect(service.addLead(1, 2, 'New')).resolves.toBeUndefined()
      expect(mockCampaignsRepository.addLead).toHaveBeenCalledWith({ campaignId: 1, leadId: 2, status: 'New' })
    })

    it('should add a lead to a campaign with default status', async () => {
      mockCampaignsRepository.exists.mockResolvedValue(true)
      mockLeadsRepository.exists.mockResolvedValue(true)
      mockCampaignsRepository.getLeadInCampaign.mockResolvedValue(null)
      mockCampaignsRepository.addLead.mockResolvedValue()
      await expect(service.addLead(1, 2)).resolves.toBeUndefined()
      expect(mockCampaignsRepository.addLead).toHaveBeenCalledWith({ campaignId: 1, leadId: 2, status: 'New' })
    })

    it('should throw error if campaign or lead does not exist', async () => {
      mockCampaignsRepository.exists.mockResolvedValue(false)
      mockLeadsRepository.exists.mockResolvedValue(true)
      await expect(service.addLead(1, 2, 'New')).rejects.toThrow('Campaign or lead not found')
    })

    it('should throw error if lead is already in campaign', async () => {
      mockCampaignsRepository.exists.mockResolvedValue(true)
      mockLeadsRepository.exists.mockResolvedValue(true)
      mockCampaignsRepository.getLeadInCampaign.mockResolvedValue({ id: 1 })
      await expect(service.addLead(1, 2, 'New')).rejects.toThrow('Lead is already in this campaign')
    })
  })

  describe('updateLeadStatus', () => {
    it('should update lead status in campaign', async () => {
      mockCampaignsRepository.getLeadInCampaign.mockResolvedValue({ id: 1 })
      mockCampaignsRepository.updateLeadStatus.mockResolvedValue()
      await expect(service.updateLeadStatus(1, 2, 'Engaged')).resolves.toBeUndefined()
      expect(mockCampaignsRepository.updateLeadStatus).toHaveBeenCalledWith({ campaignId: 1, leadId: 2, status: 'Engaged' })
    })

    it('should throw error if lead is not in campaign', async () => {
      mockCampaignsRepository.getLeadInCampaign.mockResolvedValue(null)
      await expect(service.updateLeadStatus(1, 2, 'Engaged')).rejects.toThrow('Lead is not associated with this campaign')
    })
  })

  describe('removeLead', () => {
    it('should remove a lead from a campaign', async () => {
      mockCampaignsRepository.getLeadInCampaign.mockResolvedValue({ id: 1 })
      mockCampaignsRepository.removeLead.mockResolvedValue()
      await expect(service.removeLead(1, 2)).resolves.toBeUndefined()
      expect(mockCampaignsRepository.removeLead).toHaveBeenCalledWith(1, 2)
    })

    it('should throw error if lead is not in campaign', async () => {
      mockCampaignsRepository.getLeadInCampaign.mockResolvedValue(null)
      await expect(service.removeLead(1, 2)).rejects.toThrow('Lead is not associated with this campaign')
    })
  })
})