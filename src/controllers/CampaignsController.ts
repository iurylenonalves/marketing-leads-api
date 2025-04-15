import { Handler } from "express";
import { createCampaignsRequestSchema, updateCampaignsRequestSchema } from "./schemas/CampaignsRequestSchema";
import { CampaignsService } from "../services/CampaignsService";

export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) { }

  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsService.getAllCampaigns()
      res.json(campaigns)
    } catch (error) {
      next(error)
    }
  }

  create: Handler = async (req, res, next) => {
    try {
      const body = createCampaignsRequestSchema.parse(req.body)
      const newCampaign = await this.campaignsService.createCampaign(body)
      res.status(201).json(newCampaign)
    } catch (error) {
      next(error)
    }
  }

  show: Handler = async (req, res, next) => {
    try {
      const campaign = await this.campaignsService.showCampaign(Number(req.params.id))  
      res.json(campaign)
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const body = updateCampaignsRequestSchema.parse(req.body)      
      const updatedCampaign = await this.campaignsService.updateCampaign(id, body)
      res.json(updatedCampaign)
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)      
      const deletedCampaign = await this.campaignsService.deleteCampaign(id)
      res.json({ deletedCampaign})
    } catch (error) {
      next(error)
    }
  }
}