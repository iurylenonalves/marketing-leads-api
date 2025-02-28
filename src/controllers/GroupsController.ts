import { Handler } from "express";
import { prisma } from "../database";
import { CreateGroupsRequestSchema } from "../schemas/GroupsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class GroupsController {
  index: Handler = async (req, res, next) => {
    try {
      const groups = await prisma.group.findMany()
      res.json(groups)
    } catch (error) {
      next(error)
    }
  }

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupsRequestSchema.parse(req.body)
      const newGroup = await prisma.group.create({
        data: body
      })
      res.status(201).json(newGroup)        
    } catch (error) {
      next(error)
    }
  }

  show: Handler = async (req, res, next) => {
    try {
      const group = await prisma.group.findUnique({
        where: { id: Number(req.params.id) },
        include: { leads: true}
      })

      if (!group) throw new HttpError(404, "group not found");

      res.json(group)
    } catch (error) {
      next(error)
    }
  }
}