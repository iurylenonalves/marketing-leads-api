import { Handler } from "express";
import { CreateLeadRequestSchema, GetLeadsRequestSchema, UpdateLeadRequestSchema } from "./schemas/LeadsRequestSchema";
import { LeadsService } from "../services/LeadsService";

export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  index: Handler = async (req, res, next) => {
    try {
      const parsed = GetLeadsRequestSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(", ") });
        return;
      }
      const { page = "1", pageSize = "10" } = parsed.data;

      const result = await this.leadsService.getAllLeadsPagineted({
        ...parsed.data,
        page: Number(page),
        pageSize: Number(pageSize),
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body)
      const newLead = await this.leadsService.createLead(body)
      res.status(201).json(newLead)
    } catch (error) {
      next(error)
    }
  }

  show: Handler = async(req, res, next) => {
    try {     
      const lead = await this.leadsService.getLeadById(Number(req.params.id))
      res.json(lead)
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async(req, res, next) => {
    try {
      const id = Number(req.params.id)
      const body = UpdateLeadRequestSchema.parse(req.body)
      const updatedLead = await this.leadsService.updateLead(id, body)
      res.json(updatedLead)
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async(req, res, next) => {
    try {
      const id = Number(req.params.id)
      const deletedLead = await this.leadsService.deleteLead(id)
      res.json({ deletedLead })
    } catch (error) {
      next(error)
    }
  }
}