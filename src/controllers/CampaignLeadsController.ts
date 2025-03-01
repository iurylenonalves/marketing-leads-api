import { Handler } from "express";
import { Prisma } from "@prisma/client";
import { GetCampaignLeadsRequestSchema } from "../schemas/CampaignsRequestSchema";
import { prisma } from "../database";

export class CampaignLeadsController {
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const query = GetCampaignLeadsRequestSchema.parse(req.query)
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query

      const pageNumber = Number(page)
      const pageSizeNumber = Number(pageSize)

      const where : Prisma.LeadWhereInput = {
        campaigns: {
         some: { campaignId } 
        }
      }

      if (name) where.name = {contains: name, mode: "insensitive"}
      if (status) where.campaigns = { some: { status } }

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        include: {
          campaigns: {
            select: {
              campaignId: true,
              leadId: true,
              status: true
            }
          }
        }
      })

      const totalLeads = await prisma.lead.count({ where })

      res.json({
        leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          totalLeads,
          totalPages: Math.ceil(totalLeads / pageSizeNumber)
        }
      })
    } catch (error) {
      next(error)
    }
  }
}