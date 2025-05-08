import { GroupsService } from '../GroupsService'
import { CreateGroupAttributes } from '../../repositories/GroupsRepository'

const mockGroupsRepository: any = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
}

describe('GroupsService', () => {
  let service: GroupsService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new GroupsService(mockGroupsRepository)
  })

  it('should return all groups', async () => {
    const groups = [{ id: 1, name: 'Group 1', description: 'desc' }]
    mockGroupsRepository.find.mockResolvedValue(groups)
    const result = await service.getAllGroups()
    expect(result).toEqual(groups)
  })

  it('should create a new group', async () => {
    const params: CreateGroupAttributes = { name: 'New Group', description: 'desc' }
    const created = { id: 1, ...params }
    mockGroupsRepository.create.mockResolvedValue(created)
    const result = await service.createGroup(params)
    expect(result).toEqual(created)
    expect(mockGroupsRepository.create).toHaveBeenCalledWith(params)
  })

  it('should show a group if found', async () => {
    const group = { id: 1, name: 'Group', description: 'desc' }
    mockGroupsRepository.findById.mockResolvedValue(group)
    const result = await service.showGroup(1)
    expect(result).toBe(group)
  })

  it('should throw error if group not found on show', async () => {
    mockGroupsRepository.findById.mockResolvedValue(null)
    await expect(service.showGroup(999)).rejects.toThrow('Group not found')
  })

  it('should update a group', async () => {
    const updated = { id: 1, name: 'Updated', description: 'desc' }
    mockGroupsRepository.updateById.mockResolvedValue(updated)
    const result = await service.updateGroup(1, { name: 'Updated' })
    expect(result).toEqual(updated)
  })

  it('should throw error if group not found on update', async () => {
    mockGroupsRepository.updateById.mockResolvedValue(null)
    await expect(service.updateGroup(999, { name: 'X' })).rejects.toThrow('Group not found')
  })

  it('should delete a group', async () => {
    const deleted = { id: 1, name: 'Group', description: 'desc' }
    mockGroupsRepository.deleteById.mockResolvedValue(deleted)
    const result = await service.deleteGroup(1)
    expect(result).toBe(deleted)
  })

  it('should throw error if group not found on delete', async () => {
    mockGroupsRepository.deleteById.mockResolvedValue(null)
    await expect(service.deleteGroup(999)).rejects.toThrow('Group not found')
  })
})