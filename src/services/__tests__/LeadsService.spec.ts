import { LeadsService } from '../LeadsService'
import { LeadsRepository, CreateLeadAttributes, LeadStatus } from '../../repositories/LeadsRepository'
import { HttpError } from '../../errors/HttpError'

const mockLeadsRepository: any = {
  find: jest.fn(),
  findById: jest.fn(),
  count: jest.fn(),
  exists: jest.fn(),
  create: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
}

describe('LeadsService', () => {
  let service: LeadsService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new LeadsService(mockLeadsRepository)
  })

  it('should paginate and return leads', async () => {
    mockLeadsRepository.find.mockResolvedValue([{ id: 1 }])
    mockLeadsRepository.count.mockResolvedValue(1)
    const result = await service.getAllLeadsPagineted({ page: 1, pageSize: 10 })
    expect(result.leads).toHaveLength(1)
    expect(result.meta.total).toBe(1)
    expect(mockLeadsRepository.find).toHaveBeenCalled()
    expect(mockLeadsRepository.count).toHaveBeenCalled()
  })

  it('should filter leads by name', async () => {
    mockLeadsRepository.find.mockResolvedValue([{ id: 1, name: 'Jane' }])
    mockLeadsRepository.count.mockResolvedValue(1)
    const result = await service.getAllLeadsPagineted({ page: 1, pageSize: 10, name: 'Jane' })
    expect(mockLeadsRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ name: { like: 'Jane', mode: 'insensitive' } }) })
    )
    expect(result.leads[0].name).toBe('Jane')
  })

  it('should filter leads by status', async () => {
    mockLeadsRepository.find.mockResolvedValue([{ id: 1, status: 'New' }])
    mockLeadsRepository.count.mockResolvedValue(1)
    const result = await service.getAllLeadsPagineted({ page: 1, pageSize: 10, status: 'New' })
    expect(mockLeadsRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: 'New' }) })
    )
    expect(result.leads[0].status).toBe('New')
  })

  it('should throw error if lead not found', async () => {
    mockLeadsRepository.findById.mockResolvedValue(null)
    await expect(service.getLeadById(123)).rejects.toThrow(HttpError)
  })

  it('should return lead if found', async () => {
    const lead = { id: 1 }
    mockLeadsRepository.findById.mockResolvedValue(lead)
    const result = await service.getLeadById(1)
    expect(result).toBe(lead)
  })

  it('should create a new lead with default status', async () => {
    const params: CreateLeadAttributes = { name: 'Jane', email: 'jane@mail.com', phone: '123' }
    const createdLead = { id: 1, ...params, status: 'New' }
    mockLeadsRepository.create.mockResolvedValue(createdLead)
    const result = await service.createLead(params)
    expect(result).toEqual(createdLead)
    expect(mockLeadsRepository.create).toHaveBeenCalledWith({ ...params, status: 'New' })
  })

  it('should update a lead', async () => {
    const lead = { id: 1, status: 'Contacted', updatedAt: new Date() }
    mockLeadsRepository.findById.mockResolvedValue(lead)
    mockLeadsRepository.updateById.mockResolvedValue({ ...lead, name: 'Updated' })
    const result = await service.updateLead(1, { name: 'Updated' })
    expect(result!.name).toBe('Updated')
  })

  it('should throw error if lead not found when updating', async () => {
    mockLeadsRepository.findById.mockResolvedValue(null)
    await expect(service.updateLead(999, { name: 'Does not exist' }))
      .rejects.toThrow('lead not found')
  })

  it('should not update status from New to non-Contacted', async () => {
    const lead = { id: 1, status: 'New', updatedAt: new Date() }
    mockLeadsRepository.findById.mockResolvedValue(lead)
    await expect(service.updateLead(1, { status: 'Qualified' as LeadStatus }))
      .rejects.toThrow('a new lead can only be contacted before having its status updated to other values')
  })

  it('should not archive lead before 6 months', async () => {
    const lead = { id: 1, status: 'Contacted', updatedAt: new Date() }
    mockLeadsRepository.findById.mockResolvedValue(lead)
    await expect(service.updateLead(1, { status: 'Archived' }))
      .rejects.toThrow('a lead can only be archived after 6 months of inactivity')
  })

  it('should delete a lead', async () => {
    const lead = { id: 1 }
    mockLeadsRepository.findById.mockResolvedValue(lead)
    mockLeadsRepository.deleteById.mockResolvedValue(lead)
    const result = await service.deleteLead(1)
    expect(result).toBe(lead)
    expect(mockLeadsRepository.deleteById).toHaveBeenCalledWith(1)
  })

  it('should throw error when deleting non-existent lead', async () => {
    mockLeadsRepository.findById.mockResolvedValue(null)
    await expect(service.deleteLead(1)).rejects.toThrow('lead not found')
  })
})