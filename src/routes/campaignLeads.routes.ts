import { Router } from "express";
import { CampaignLeadsController } from "../controllers/CampaignLeadsController";
import { campaignLeadsService } from "./dependencies";

const campaignLeadsRouter = Router({ mergeParams: true });
const campaignLeadsController = new CampaignLeadsController(campaignLeadsService);

/**
 * @swagger
 * /campaigns/{campaignId}/leads:
 *   get:
 *     summary: Get all leads in a campaign
 *     tags: [Campaign Leads]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the campaign
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: string
 *         description: Page size
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter leads by name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [New, Engaged, FollowUp_Scheduled, Contacted, Qualified, Converted, Unresponsive, Disqualified, Re_Engaged, Opted_Out]
 *         description: Filter leads by status in the campaign
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: List of leads in the campaign with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leads:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lead'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
campaignLeadsRouter.get("/", campaignLeadsController.getLeads);

/**
 * @swagger
 * /campaigns/{campaignId}/leads:
 *   post:
 *     summary: Add a lead to a campaign
 *     tags: [Campaign Leads]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the campaign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *             properties:
 *               leadId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 enum: [New, Engaged, FollowUp_Scheduled, Contacted, Qualified, Converted, Unresponsive, Disqualified, Re_Engaged, Opted_Out]
 *                 default: "New"
 *     responses:
 *       201:
 *         description: Lead added to campaign successfully
 *       404:
 *         description: Campaign or lead not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Lead is already in this campaign
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
campaignLeadsRouter.post("/", campaignLeadsController.addLead);

/**
 * @swagger
 * /campaigns/{campaignId}/leads/{leadId}:
 *   put:
 *     summary: Update lead status in a campaign
 *     tags: [Campaign Leads]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the campaign
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lead
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [New, Engaged, FollowUp_Scheduled, Contacted, Qualified, Converted, Unresponsive, Disqualified, Re_Engaged, Opted_Out]
 *                 example: "Engaged"
 *     responses:
 *       200:
 *         description: Lead status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lead status updated"
 *       404:
 *         description: Campaign, lead, or relationship not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
campaignLeadsRouter.put("/:leadId", campaignLeadsController.updateLeadStatus);

/**
 * @swagger
 * /campaigns/{campaignId}/leads/{leadId}:
 *   delete:
 *     summary: Remove a lead from a campaign
 *     tags: [Campaign Leads]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the campaign
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lead
 *     responses:
 *       200:
 *         description: Lead removed from campaign successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lead removed from campaign"
 *       404:
 *         description: Campaign, lead, or relationship not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
campaignLeadsRouter.delete("/:leadId", campaignLeadsController.removeLead);

export { campaignLeadsRouter };