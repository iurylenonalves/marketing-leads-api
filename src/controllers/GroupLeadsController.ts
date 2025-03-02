import { Handler } from "express";
import { GetLeadsRequestSchema } from "../schemas/LeadsRequestSchema";
import { Prisma } from "@prisma/client";
import { prisma } from "../database";


export class GroupLeadsController {
  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId)
      const query = GetLeadsRequestSchema.parse(req.query)
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query

      const pageNumber = Number(page)
      const pageSizeNumber = Number(pageSize)

      const where: Prisma.LeadWhereInput = {
        groups: {
          some: { id: groupId }
        }
      }

      if (name) where.name = { contains: name, mode: "insensitive" }
      if (status) where.status = status

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        include: {
          groups: true
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