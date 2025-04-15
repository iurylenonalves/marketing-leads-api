import { Router } from "express";
import { GroupLeadsController } from "../controllers/GroupLeadsController";
import { groupLeadsService } from "./dependencies";

const groupLeadsRouter = Router({ mergeParams: true });
const groupLeadsController = new GroupLeadsController(groupLeadsService);

groupLeadsRouter.get("/", groupLeadsController.getLeads);
groupLeadsRouter.post("/", groupLeadsController.addLead);
groupLeadsRouter.delete("/:leadId", groupLeadsController.removeLead);

export { groupLeadsRouter };