import request from 'supertest';
import app from '../../app';
import { prisma } from '../../database';

describe('Campaigns E2E CRUD', () => {
  let campaignId: number;

  afterEach(async () => {
    if (campaignId) {
      await prisma.campaign.delete({ where: { id: campaignId } }).catch(() => {});
      campaignId = 0;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new campaign', async () => {
    const timestamp = Date.now();
    const res = await request(app)
      .post('/api/campaigns')
      .send({
        name: `Campaign Test ${timestamp}`,
        description: 'Test campaign',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString()
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toContain('Campaign Test');
    campaignId = res.body.id;
  });

  it('should list campaigns', async () => {
    const timestamp = Date.now();
    const campaign = await prisma.campaign.create({
      data: {
        name: `Campaign List ${timestamp}`,
        description: 'List campaign',
        startDate: new Date()
      }
    });
    campaignId = campaign.id;

    const res = await request(app)
      .get('/api/campaigns')
      .expect(200);

    expect(Array.isArray(res.body.campaigns)).toBe(true);
    expect(res.body.campaigns.some((c: any) => c.id === campaignId)).toBe(true);
  });

  it('should get a campaign by id', async () => {
    const timestamp = Date.now();
    const campaign = await prisma.campaign.create({
      data: {
        name: `Campaign ById ${timestamp}`,
        description: 'ById campaign',
        startDate: new Date()
      }
    });
    campaignId = campaign.id;

    const res = await request(app)
      .get(`/api/campaigns/${campaignId}`)
      .expect(200);

    expect(res.body.id).toBe(campaignId);
    expect(res.body.name).toContain('Campaign ById');
  });

  it('should update a campaign', async () => {
    const timestamp = Date.now();
    const campaign = await prisma.campaign.create({
      data: {
        name: `Campaign Update ${timestamp}`,
        description: 'Update campaign',
        startDate: new Date()
      }
    });
    campaignId = campaign.id;

    const res = await request(app)
      .put(`/api/campaigns/${campaignId}`)
      .send({ name: 'Campaign Updated' })
      .expect(200);

    expect(res.body.name).toBe('Campaign Updated');
  });

  it('should delete a campaign', async () => {
    const timestamp = Date.now();
    const campaign = await prisma.campaign.create({
      data: {
        name: `Campaign Delete ${timestamp}`,
        description: 'Delete campaign',
        startDate: new Date()
      }
    });
    campaignId = campaign.id;

    await request(app)
      .delete(`/api/campaigns/${campaignId}`)
      .expect(200);

    const deleted = await prisma.campaign.findUnique({ where: { id: campaignId } });
    expect(deleted).toBeNull();
    campaignId = 0;
  });
});