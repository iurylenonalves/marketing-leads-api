import { Router } from "express";
import { HttpError } from "./errors/HttpError";
import { LeadsController } from "./controllers/LeadsController";
import { GroupsController } from "./controllers/GroupsController";
import { CampaignsController } from "./controllers/CampaignsController";

const router = Router()

const leadsController = new LeadsController()
const groupsController = new GroupsController()
const campaignsController = new CampaignsController()

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


router.get("/status", async (req,res, next) => {
  try {
    throw new HttpError(401, "Unauthorized")
    res.json({ message: "OK" })
  } catch (error) {
    next(error)
  }
})

export { router }
