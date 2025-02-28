import { Handler } from "express";
import { prisma } from "../database";

export class CampaingnsController {
  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await prisma.campaign.findMany()
      res.json(campaigns)
    } catch (error) {
      next(error)
    }
  }
}