import { Router } from "express";
import { LeadsController } from "../controllers/LeadsController";
import { leadsService } from "./dependencies";

const leadsRouter = Router();
const leadsController = new LeadsController(leadsService);

leadsRouter.get("/", leadsController.index);
leadsRouter.post("/", leadsController.create);
leadsRouter.get("/:id", leadsController.show);
leadsRouter.put("/:id", leadsController.update);
leadsRouter.delete("/:id", leadsController.delete);

export { leadsRouter };