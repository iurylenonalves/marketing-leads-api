import { Router } from "express";
import { HttpError } from "../errors/HttpError";
import { leadsRouter } from "./leads.routes";
import { groupsRouter } from "./groups.routes";
import { campaignsRouter } from "./campaigns.routes";
import { groupLeadsRouter } from "./groupLeads.routes";
import { campaignLeadsRouter } from "./campaignLeads.routes";

const router = Router()

router.use("/leads", leadsRouter);
router.use("/groups", groupsRouter);
router.use("/campaigns", campaignsRouter);

router.use("/groups/:groupId/leads", groupLeadsRouter);
router.use("/campaigns/:campaignId/leads", campaignLeadsRouter);


router.get("/status", async (req,res, next) => {
  try {
    throw new HttpError(401, "Unauthorized")
    res.json({ message: "OK" })
  } catch (error) {
    next(error)
  }
})

export { router }
