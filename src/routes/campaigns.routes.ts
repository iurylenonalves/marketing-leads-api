import { Router } from "express";
import { CampaignsController } from "../controllers/CampaignsController";
import { campaignsService } from "./dependencies";

const campaignsRouter = Router();
const campaignsController = new CampaignsController(campaignsService);

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Returns all campaigns
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: List of campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 */
campaignsRouter.get("/", campaignsController.index);

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Creates a new campaign
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Summer Sale 2023"
 *               description:
 *                 type: string
 *                 example: "Promotion for summer products"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-06-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-08-31"
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
campaignsRouter.post("/", campaignsController.create);

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the campaign
 *     responses:
 *       200:
 *         description: Campaign details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
campaignsRouter.get("/:id", campaignsController.show);

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Update an existing campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Campaign updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
campaignsRouter.put("/:id", campaignsController.update);

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Delete a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the campaign
 *     responses:
 *       200:
 *         description: Campaign deleted successfully
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
campaignsRouter.delete("/:id", campaignsController.delete);

export { campaignsRouter };