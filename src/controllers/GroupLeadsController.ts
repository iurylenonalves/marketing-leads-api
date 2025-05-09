import { Handler } from "express";
import { GetLeadsRequestSchema } from "./schemas/LeadsRequestSchema";
import { AddLeadRequestSchema } from "./schemas/GroupsRequestSchema";
import { GroupLeadsService } from "../services/GroupLeadsService";


export class GroupLeadsController {
  constructor(private readonly groupLeadsService: GroupLeadsService) {}

  getLeads: Handler = async (req, res, next) => {       
    try {
    const groupId = Number(req.params.groupId);
    if (isNaN(groupId)) {
      res.status(400).json({ error: "Invalid groupId param" });
      return;
    }
    const parsed = GetLeadsRequestSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(", ") });
      return;
    }
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = parsed.data;

      const result = await this.groupLeadsService.getLeads({
        groupId,
        page: Number(page),
        pageSize: Number(pageSize),
        name,
        status,
        sortBy,
        order
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId)
      const { leadId } = AddLeadRequestSchema.parse(req.body)
      const updatedGroup = await this.groupLeadsService.addLead(groupId, leadId)        
      res.status(201).json(updatedGroup)
    } catch (error) {
      next(error)
    }
  }

  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId)
      const leadId = Number(req.params.leadId)
      const updatedGroup = await this.groupLeadsService.removeLead(groupId, leadId)    
      res.json(updatedGroup)
    } catch (error) {
      next(error)
    }
  }
}