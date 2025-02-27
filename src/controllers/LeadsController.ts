import { Handler } from "express";
import { prisma } from "../database";
import { CreateLeadRequestSchema } from "../schemas/LeadsRequestSchema";

export class LeadsController {
  index: Handler = async (req, res, next) => {
    try {
      const leads = await prisma.lead.findMany()
      res.json(leads)
    } catch (error) {
      next(error)
    }
  }

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body)
      const newLead = await prisma.lead.create({
        data: body
      })
      res.status(201).json(newLead)
    } catch (error) {
      next(error)
    }
  }
}