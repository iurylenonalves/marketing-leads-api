import { GroupLeadsService } from '../GroupLeadsService'

const mockGroupsRepository: any = {
  findById: jest.fn(),
  addLead: jest.fn(),
  removeLead: jest.fn(),
  hasLead: jest.fn(),
}
const mockLeadsRepository: any = {
  findById: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
}

describe('GroupLeadsService', () => {
  let service: GroupLeadsService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new GroupLeadsService(mockGroupsRepository, mockLeadsRepository)
  })

  it('should add a lead to a group', async () => {
    const group = { id: 1 }
    const lead = { id: 2 }
    const updatedGroup = { id: 1, leads: [lead] }
    mockGroupsRepository.findById.mockResolvedValue(group)
    mockLeadsRepository.findById.mockResolvedValue(lead)
    mockGroupsRepository.addLead.mockResolvedValue(updatedGroup)
    const result = await service.addLead(1, 2)
    expect(result).toBe(updatedGroup)
    expect(mockGroupsRepository.addLead).toHaveBeenCalledWith(1, 2)
  })

  it('should throw error if group not found when adding lead', async () => {
    mockGroupsRepository.findById.mockResolvedValue(null)
    await expect(service.addLead(1, 2)).rejects.toThrow('Group not found')
  })

  it('should throw error if lead not found when adding to group', async () => {
    mockGroupsRepository.findById.mockResolvedValue({ id: 1 })
    mockLeadsRepository.findById.mockResolvedValue(null)
    await expect(service.addLead(1, 2)).rejects.toThrow('Lead not found')
  })

  it('should remove a lead from a group', async () => {
    const group = { id: 1 }
    const lead = { id: 2 }
    const updatedGroup = { id: 1, leads: [] }
    mockGroupsRepository.findById.mockResolvedValue(group)
    mockLeadsRepository.findById.mockResolvedValue(lead)
    mockGroupsRepository.hasLead.mockResolvedValue(true)
    mockGroupsRepository.removeLead.mockResolvedValue(updatedGroup)
    const result = await service.removeLead(1, 2)
    expect(result).toBe(updatedGroup)
    expect(mockGroupsRepository.removeLead).toHaveBeenCalledWith(1, 2)
  })

  it('should throw error if group not found when removing lead', async () => {
    mockGroupsRepository.findById.mockResolvedValue(null)
    await expect(service.removeLead(1, 2)).rejects.toThrow('Group not found')
  })

  it('should throw error if lead not found when removing from group', async () => {
    mockGroupsRepository.findById.mockResolvedValue({ id: 1 })
    mockLeadsRepository.findById.mockResolvedValue(null)
    await expect(service.removeLead(1, 2)).rejects.toThrow('Lead not found')
  })

  it('should throw error if lead is not in group when removing', async () => {
    mockGroupsRepository.findById.mockResolvedValue({ id: 1 })
    mockLeadsRepository.findById.mockResolvedValue({ id: 2 })
    mockGroupsRepository.hasLead.mockResolvedValue(false)
    await expect(service.removeLead(1, 2)).rejects.toThrow('Lead not associated with this group')
  })

  it('should return paginated leads for a group', async () => {
    const leads = [{ id: 2, name: 'Lead', status: 'New' }]
    mockLeadsRepository.find.mockResolvedValue(leads)
    mockLeadsRepository.count.mockResolvedValue(1)
    const result = await service.getLeads({ groupId: 1, page: 1, pageSize: 10 })
    expect(result.leads).toEqual(leads)
    expect(result.meta.total).toBe(1)
    expect(result.meta.page).toBe(1)
    expect(result.meta.pageSize).toBe(10)
  })

  it('should filter leads by name', async () => {
    const leads = [{ id: 2, name: 'Lead', status: 'New' }]
    mockLeadsRepository.find.mockResolvedValue(leads)
    mockLeadsRepository.count.mockResolvedValue(1)
    const result = await service.getLeads({ groupId: 1, name: 'Lead' })
    expect(mockLeadsRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ name: { like: 'Lead', mode: 'insensitive' } }) })
    )
    expect(result.leads).toEqual(leads)
  })

  it('should filter leads by status', async () => {
    const leads = [{ id: 2, name: 'Lead', status: 'New' }]
    mockLeadsRepository.find.mockResolvedValue(leads)
    mockLeadsRepository.count.mockResolvedValue(1)
    const result = await service.getLeads({ groupId: 1, status: 'New' })
    expect(mockLeadsRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: 'New' }) })
    )
    expect(result.leads).toEqual(leads)
  })
})