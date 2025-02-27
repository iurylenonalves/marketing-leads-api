import { Router } from "express";
import { HttpError } from "./errors/HttpError";
import { LeadsController } from "./controllers/LeadsController";

const router = Router()

const leadsController = new LeadsController()

router.get("/leads", leadsController.index)
router.post("/leads", leadsController.create)
router.get("/leads/:id", leadsController.show)

router.get("/status", async (req,res, next) => {
  try {
    throw new HttpError(401, "Unauthorized")
    res.json({ message: "OK" })
  } catch (error) {
    next(error)
  }
})

export { router }
