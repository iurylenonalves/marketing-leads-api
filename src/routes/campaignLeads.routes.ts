import { Router } from "express";
import { CampaignLeadsController } from "../controllers/CampaignLeadsController";
import { campaignLeadsService } from "./dependencies";

const campaignLeadsRouter = Router({ mergeParams: true });
const campaignLeadsController = new CampaignLeadsController(campaignLeadsService);

campaignLeadsRouter.get("/", campaignLeadsController.getLeads);
campaignLeadsRouter.post("/", campaignLeadsController.addLead);
campaignLeadsRouter.put("/:leadId", campaignLeadsController.updateLeadStatus);
campaignLeadsRouter.delete("/:leadId", campaignLeadsController.removeLead);

export { campaignLeadsRouter };