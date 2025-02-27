import { Handler } from "express";
import { prisma } from "../database";

export class LeadsController {
  index: Handler = async (req, res, next) => {
    try {
      const leads = await prisma.lead.findMany()
    } catch (error) {
      next(error)
    }
  }
}