import { Handler } from "express";
import { AddLeadRequestSchema, GetCampaignLeadsRequestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignsRequestSchema";
import { CampaignLeadsService } from "../services/CampaignLeadsService";

export class CampaignLeadsController {
  constructor(private readonly campaignLeadsService: CampaignLeadsService) { }

  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);
      if (isNaN(campaignId)) {
        res.status(400).json({ error: "Invalid campaignId param" });
        return;
      }

      const parsed = GetCampaignLeadsRequestSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(", ") });
        return;
      }
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = parsed.data;

      const result = await this.campaignLeadsService.getLeads({
        campaignId,
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
      const campaignId = Number(req.params.campaignId)
      const { leadId, status = "New" } = AddLeadRequestSchema.parse(req.body)      
      await this.campaignLeadsService.addLead( campaignId, leadId, status )
      
      const result = await this.campaignLeadsService.getLeads({ campaignId })
      res.status(201).json({ leads: result.leads })
    } catch (error) {
      next(error)
    }
  }

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)
      const {status} = UpdateLeadStatusRequestSchema.parse(req.body)
      await this.campaignLeadsService.updateLeadStatus( campaignId, leadId, status )
      res.status(200).json({ status })
    } catch (error) {
      next(error)
    }
  }

  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)
      await this.campaignLeadsService.removeLead(campaignId, leadId)

      const result = await this.campaignLeadsService.getLeads({ campaignId })
      res.status(200).json({ leads: result.leads })
    } catch (error) {
      next(error)
    }
  }
}