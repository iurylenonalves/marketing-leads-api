import { Router } from "express";
import { CampaignsController } from "../controllers/CampaignsController";
import { campaignsService } from "./dependencies";

const campaignsRouter = Router();
const campaignsController = new CampaignsController(campaignsService);

campaignsRouter.get("/", campaignsController.index);
campaignsRouter.post("/", campaignsController.create);
campaignsRouter.get("/:id", campaignsController.show);
campaignsRouter.put("/:id", campaignsController.update);
campaignsRouter.delete("/:id", campaignsController.delete);

export { campaignsRouter };