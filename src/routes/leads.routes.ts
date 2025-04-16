import { Router } from "express";
import { LeadsController } from "../controllers/LeadsController";
import { leadsService } from "./dependencies";

const leadsRouter = Router();
const leadsController = new LeadsController(leadsService);

/**
 * @swagger
 * /leads:
 *   get:
 *     summary: Returns all leads
 *     tags: [Leads]
 *     parameters:
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
 *         description: Filter by name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [New, Contacted, Qualified, Converted, Unresponsive, Disqualified, Archived]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, status, createdAt]
 *         description: Sorting field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sorting direction
 *     responses:
 *       200:
 *         description: List of leads with pagination metadata
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
 */
leadsRouter.get("/", leadsController.index);

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "example@example.com"
 *               phone:
 *                 type: string
 *                 example: "(555) 123-4567"
 *               status:
 *                 type: string
 *                 enum: [New, Contacted, Qualified, Converted, Unresponsive, Disqualified, Archived]
 *                 default: "New"
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
leadsRouter.post("/", leadsController.create);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     summary: Returns a specific lead by ID
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lead
 *     responses:
 *       200:
 *         description: Lead details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       404:
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
leadsRouter.get("/:id", leadsController.show);

/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     summary: Update an existing lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [New, Contacted, Qualified, Converted, Unresponsive, Disqualified, Archived]
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       404:
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
leadsRouter.put("/:id", leadsController.update);

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Remove a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lead
 *     responses:
 *       200:
 *         description: Lead removed successfully
 *       404:
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
leadsRouter.delete("/:id", leadsController.delete);

export { leadsRouter };