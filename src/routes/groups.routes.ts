import { Router } from "express";
import { GroupsController } from "../controllers/GroupsController";
import { groupsService } from "./dependencies";

const groupsRouter = Router();
const groupsController = new GroupsController(groupsService);

groupsRouter.get("/", groupsController.index);
groupsRouter.post("/", groupsController.create);
groupsRouter.get("/:id", groupsController.show);
groupsRouter.put("/:id", groupsController.update);
groupsRouter.delete("/:id", groupsController.delete);

export { groupsRouter };