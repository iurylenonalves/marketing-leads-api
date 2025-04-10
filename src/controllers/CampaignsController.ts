import { Handler } from "express";
import { prisma } from "../database";
import { createCampaignsRequestSchema, updateCampaignsRequestSchema } from "./schemas/CampaignsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class CampaignsController {
  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await prisma.campaign.findMany()
      res.json(campaigns)
    } catch (error) {
      next(error)
    }
  }

  create: Handler = async (req, res, next) => {
    try {
      const body = createCampaignsRequestSchema.parse(req.body)
      const newCampaign = await prisma.campaign.create({ data: body})
      res.status(201).json(newCampaign)
    } catch (error) {
      next(error)
    }
  }

  show: Handler = async (req, res, next) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: Number(req.params.id) },
        include: { 
          leads: {
            include: {
              lead: true
            }
          } 
        }
      })

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

      const campaignExists = await prisma.campaign.findUnique({ where: { id} })
      if (!campaignExists) throw new HttpError(404, "campaign not found")

      const updatedCampaign = await prisma.campaign.update({ data: body, where: { id } })

      res.json(updatedCampaign)
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      
      const campaignIdExists = await prisma.campaign.findUnique({ where: { id } })
      if (!campaignIdExists) throw new HttpError(404, "campaign not found");

      const deletedCampaign = await prisma.campaign.delete({ where: { id } })

      res.json({ deletedCampaign})
    } catch (error) {
      next(error)
    }
  }
}