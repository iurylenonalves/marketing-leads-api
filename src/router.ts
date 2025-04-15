import { Router } from "express";
import { HttpError } from "./errors/HttpError";
import { LeadsController } from "./controllers/LeadsController";
import { GroupsController } from "./controllers/GroupsController";
import { CampaignsController } from "./controllers/CampaignsController";
import { CampaignLeadsController } from "./controllers/CampaignLeadsController";
import { GroupLeadsController } from "./controllers/GroupLeadsController";
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository";
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository";
import { PrismaCampaignsRepository } from "./repositories/prisma/PrismaCampaignsRepository";
import { LeadsService } from "./services/LeadsService";
import { GroupsService } from "./services/GroupsService";
import { GroupLeadsService } from "./services/GroupLeadsService";
import { CampaignsService } from "./services/CampaignsService";
import { CampaignLeadsService } from "./services/CampaignLeadsService";

const router = Router()

const leadsRepository = new PrismaLeadsRepository()
const groupsRepository = new PrismaGroupsRepository()
const campaignsRepository = new PrismaCampaignsRepository()

export const leadsService = new LeadsService(leadsRepository)
export const groupsService = new GroupsService(groupsRepository)
export const groupLeadsService = new GroupLeadsService(groupsRepository, leadsRepository)
export const campaignsService = new CampaignsService(campaignsRepository)
export const campaignLeadsService = new CampaignLeadsService(campaignsRepository, leadsRepository)

const leadsController = new LeadsController(leadsService)
const groupsController = new GroupsController(groupsService)
const groupLeadsController = new GroupLeadsController(groupLeadsService)
const campaignsController = new CampaignsController(campaignsService)
const campaignLeadsController = new CampaignLeadsController(campaignLeadsService)

router.get("/leads", leadsController.index)
router.post("/leads", leadsController.create)
router.get("/leads/:id", leadsController.show)
router.put("/leads/:id", leadsController.update)
router.delete("/leads/:id", leadsController.delete)

router.get("/groups", groupsController.index)
router.post("/groups", groupsController.create)
router.get("/groups/:id", groupsController.show)
router.put("/groups/:id", groupsController.update)
router.delete("/groups/:id", groupsController.delete)

router.get("/campaigns", campaignsController.index)
router.post("/campaigns", campaignsController.create)
router.get("/campaigns/:id", campaignsController.show)
router.put("/campaigns/:id", campaignsController.update)
router.delete("/campaigns/:id", campaignsController.delete)

router.get("/campaigns/:campaignId/leads", campaignLeadsController.getLeads)
router.post("/campaigns/:campaignId/leads", campaignLeadsController.addLead)
router.put("/campaigns/:campaignId/leads/:leadId", campaignLeadsController.updateLeadStatus)
router.delete("/campaigns/:campaignId/leads/:leadId", campaignLeadsController.removeLead)

router.get("/groups/:groupId/leads", groupLeadsController.getLeads)
router.post("/groups/:groupId/leads", groupLeadsController.addLead)
router.delete("/groups/:groupId/leads/:leadId", groupLeadsController.removeLead)


router.get("/status", async (req,res, next) => {
  try {
    throw new HttpError(401, "Unauthorized")
    res.json({ message: "OK" })
  } catch (error) {
    next(error)
  }
})

export { router }
