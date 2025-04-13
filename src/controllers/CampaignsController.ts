import { Handler } from "express";
import { createCampaignsRequestSchema, updateCampaignsRequestSchema } from "./schemas/CampaignsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { CampaignsRepository } from "../repositories/CampaignsRepository";

export class CampaignsController {
  constructor(private readonly campaignsRepository: CampaignsRepository) { }

  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsRepository.find()
      res.json(campaigns)
    } catch (error) {
      next(error)
    }
  }

  create: Handler = async (req, res, next) => {
    try {
      const body = createCampaignsRequestSchema.parse(req.body)
      const newCampaign = await this.campaignsRepository.create(body)
      res.status(201).json(newCampaign)
    } catch (error) {
      next(error)
    }
  }

  show: Handler = async (req, res, next) => {
    try {
      const campaign = await this.campaignsRepository.findById(Number(req.params.id))      
      if (!campaign) throw new HttpError(404, "campaign not found")

      res.json(campaign)
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const body = updateCampaignsRequestSchema.parse(req.body)
      
      const updatedCampaign = await this.campaignsRepository.updateById(id, body)
      if (!updatedCampaign) throw new HttpError(404, "campaign not found")

      res.json(updatedCampaign)
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)      
      
      const deletedCampaign = await this.campaignsRepository.deleteById(id)
      if (!deletedCampaign) throw new HttpError(404, "campaign not found");

      res.json({ deletedCampaign})
    } catch (error) {
      next(error)
    }
  }
}