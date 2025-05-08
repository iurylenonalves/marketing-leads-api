import { HttpError } from "../errors/HttpError";
import { GroupsRepository } from "../repositories/GroupsRepository";
import { LeadsRepository, LeadStatus, LeadWhereParams } from "../repositories/LeadsRepository";

interface GetLeadsParams {
  groupId: number;
  page?: number;
  pageSize?: number;
  name?: string;
  status?: LeadStatus;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
}

export class GroupLeadsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}

  async getLeads(params: GetLeadsParams) {
    const { 
      groupId, 
      page = 1, 
      pageSize = 10, 
      name, 
      status, 
      sortBy = "name", 
      order = "asc" 
    } = params;

    const limit = pageSize;
    const offset = (page - 1) * limit;

    const where: LeadWhereParams = { groupId };
    
    if (name) where.name = { like: name, mode: "insensitive" };
    if (status) where.status = status;

    const leads = await this.leadsRepository.find({ 
      where, 
      sortBy, 
      order, 
      limit, 
      offset,
      include: { groups: true} 
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

  async addLead(groupId: number, leadId: number) {
    // Verificar se o grupo existe
    const group = await this.groupsRepository.findById(groupId);
    if (!group) throw new HttpError(404, "Group not found");
    
    // Verificar se o lead existe
    const lead = await this.leadsRepository.findById(leadId);
    if (!lead) throw new HttpError(404, "Lead not found");
    
    // Adicionar o lead ao grupo
    const updatedGroup = await this.groupsRepository.addLead(groupId, leadId);
    return updatedGroup;
  }

  async removeLead(groupId: number, leadId: number) {
    // Verificar se o grupo existe
    const group = await this.groupsRepository.findById(groupId);
    if (!group) throw new HttpError(404, "Group not found");
    
    // Verificar se o lead existe
    const lead = await this.leadsRepository.findById(leadId);
    if (!lead) throw new HttpError(404, "Lead not found");
    
    // Verificar se o lead está no grupo
    const leadInGroup = await this.groupsRepository.hasLead(groupId, leadId);
    if (!leadInGroup) throw new HttpError(404, "Lead not associated with this group");
    
    // Remover o lead do grupo
    const updatedGroup = await this.groupsRepository.removeLead(groupId, leadId);
    return updatedGroup;
  }
}