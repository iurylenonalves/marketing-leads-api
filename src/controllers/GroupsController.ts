import { Handler } from "express";
import { prisma } from "../database";
import { CreateGroupsRequestSchema, UpdateGroupsRequestSchema } from "../schemas/GroupsRequestSchema";
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

  update: Handler = async(req, res, next) => {
      try {
        const id = Number(req.params.id)
        const body = UpdateGroupsRequestSchema.parse(req.body)
  
        const groupExists = await prisma.group.findUnique({ where: { id } })
        if (!groupExists) throw new HttpError(404, "lead not found");
  
        const updatedGroup = await prisma.group.update({ data: body, where: { id } })
  
        res.json(updatedGroup)
      } catch (error) {
        next(error)
      }
    }

    delete: Handler = async(req, res, next) => {
      try {
        const id = Number(req.params.id)
  
        const groupIdExists = await prisma.group.findUnique({ where: { id } })
        if (!groupIdExists) throw new HttpError(404, "lead not found");
  
        const deletedGroup = await prisma.group.delete({ where: { id }})
  
        res.json({ deletedGroup })
      } catch (error) {
        next(error)
      }
    }
}