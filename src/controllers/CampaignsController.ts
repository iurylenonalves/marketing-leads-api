import { Handler } from "express";
import { prisma } from "../database";
import { createCampaignsRequestSchema } from "../schemas/CampaignsRequestSchema";
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
}