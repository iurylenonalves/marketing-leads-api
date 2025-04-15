import { PrismaLeadsRepository } from "../repositories/prisma/PrismaLeadsRepository";
import { PrismaGroupsRepository } from "../repositories/prisma/PrismaGroupsRepository";
import { PrismaCampaignsRepository } from "../repositories/prisma/PrismaCampaignsRepository";
import { LeadsService } from "../services/LeadsService";
import { GroupsService } from "../services/GroupsService";
import { GroupLeadsService } from "../services/GroupLeadsService";
import { CampaignsService } from "../services/CampaignsService";
import { CampaignLeadsService } from "../services/CampaignLeadsService";

const leadsRepository = new PrismaLeadsRepository();
const groupsRepository = new PrismaGroupsRepository();
const campaignsRepository = new PrismaCampaignsRepository();

export const leadsService = new LeadsService(leadsRepository);
export const groupsService = new GroupsService(groupsRepository);
export const groupLeadsService = new GroupLeadsService(groupsRepository, leadsRepository);
export const campaignsService = new CampaignsService(campaignsRepository);
export const campaignLeadsService = new CampaignLeadsService(campaignsRepository, leadsRepository);