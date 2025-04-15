import { Router } from "express";
import { GroupLeadsController } from "../controllers/GroupLeadsController";
import { groupLeadsService } from "./dependencies";

const groupLeadsRouter = Router({ mergeParams: true });
const groupLeadsController = new GroupLeadsController(groupLeadsService);

/**
 * @swagger
 * /groups/{groupId}/leads:
 *   get:
 *     summary: Get all leads in a group
 *     tags: [Group Leads]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the group
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
 *           enum: [New, Contacted, Qualified, Converted, Unresponsive, Disqualified, Archived]
 *         description: Filter leads by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, status, createdAt]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: List of leads in the group with pagination metadata
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
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
groupLeadsRouter.get("/", groupLeadsController.getLeads);

/**
 * @swagger
 * /groups/{groupId}/leads:
 *   post:
 *     summary: Add a lead to a group
 *     tags: [Group Leads]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the group
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
 *     responses:
 *       201:
 *         description: Lead added to group successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Group or lead not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
groupLeadsRouter.post("/", groupLeadsController.addLead);

/**
 * @swagger
 * /groups/{groupId}/leads/{leadId}:
 *   delete:
 *     summary: Remove a lead from a group
 *     tags: [Group Leads]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the group
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lead
 *     responses:
 *       200:
 *         description: Lead removed from group successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Group or lead not found, or lead not in group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
groupLeadsRouter.delete("/:leadId", groupLeadsController.removeLead);

export { groupLeadsRouter };