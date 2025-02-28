import { Handler } from "express";
import { prisma } from "../database";
import { CreateGroupsRequestSchema } from "../schemas/GroupsRequestSchema";

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
}