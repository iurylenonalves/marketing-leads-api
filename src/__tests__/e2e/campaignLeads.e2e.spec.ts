import request from 'supertest';
import app from '../../app';
import { prisma } from '../../database';

describe('CampaignLeads E2E', () => {
  let campaignId: number;
  let leadId: number;
  let secondLeadId: number;

  beforeEach(async () => {
    // Cria uma campanha e dois leads para os testes
    const timestamp = Date.now();
    const campaign = await prisma.campaign.create({
      data: {
        name: `Campaign Test ${timestamp}`,
        description: 'Test campaign',
        startDate: new Date()
      }
    });
    campaignId = campaign.id;

    const lead = await prisma.lead.create({
      data: {
        name: `Lead Test ${timestamp}`,
        email: `lead${timestamp}@mail.com`,
        phone: '123456789',
        status: 'New'
      }
    });
    leadId = lead.id;

    const secondLead = await prisma.lead.create({
      data: {
        name: `Lead Test 2 ${timestamp}`,
        email: `lead2${timestamp}@mail.com`,
        phone: '987654321',
        status: 'New'
      }
    });
    secondLeadId = secondLead.id;
  });

  afterEach(async () => {
    // Remove relacionamentos antes de deletar entidades
    await prisma.leadCampaign.deleteMany({ where: { campaignId } });
    await prisma.campaign.delete({ where: { id: campaignId } }).catch(() => {});
    await prisma.lead.delete({ where: { id: leadId } }).catch(() => {});
    await prisma.lead.delete({ where: { id: secondLeadId } }).catch(() => {});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should add a lead to a campaign', async () => {
    const res = await request(app)
      .post(`/api/campaigns/${campaignId}/leads`)
      .send({ leadId })
      .expect(201);
      
      console.log('Resposta da API:', res.body);
    expect(res.body.leads.some((l: any) => l.id === leadId)).toBe(true);
  });

  it('should list leads in a campaign', async () => {
    // Adiciona os dois leads à campanha
    await prisma.leadCampaign.createMany({
      data: [
        { campaignId, leadId, status: 'New' },
        { campaignId, leadId: secondLeadId, status: 'New' }
      ]
    });

    const res = await request(app)
      .get(`/api/campaigns/${campaignId}/leads`)
      .expect(200);

    expect(Array.isArray(res.body.leads)).toBe(true);
    expect(res.body.leads.length).toBeGreaterThanOrEqual(2);
    expect(res.body.leads.some((l: any) => l.id === leadId)).toBe(true);
    expect(res.body.leads.some((l: any) => l.id === secondLeadId)).toBe(true);
  });

  it('should update lead status in a campaign', async () => {
    await prisma.leadCampaign.create({
      data: { campaignId, leadId, status: 'New' }
    });

    const res = await request(app)
      .put(`/api/campaigns/${campaignId}/leads/${leadId}`)
      .send({ status: 'Qualified' })
      .expect(200);

    expect(res.body.status).toBe('Qualified');
  });

  it('should remove a lead from a campaign', async () => {
    await prisma.leadCampaign.create({
      data: { campaignId, leadId, status: 'New' }
    });

    const res = await request(app)
      .delete(`/api/campaigns/${campaignId}/leads/${leadId}`)
      .expect(200);

    expect(res.body.leads.some((l: any) => l.id === leadId)).toBe(false);
  });

  it('should not add the same lead twice', async () => {
    await request(app)
      .post(`/api/campaigns/${campaignId}/leads`)
      .send({ leadId })
      .expect(201);

    await request(app)
      .post(`/api/campaigns/${campaignId}/leads`)
      .send({ leadId })
      .expect(409); // Conflito
  });

  it('should return 404 for non-existent campaign or lead', async () => {
    await request(app)
      .post(`/api/campaigns/999999/leads`)
      .send({ leadId })
      .expect(404);

    await request(app)
      .post(`/api/campaigns/${campaignId}/leads`)
      .send({ leadId: 999999 })
      .expect(404);
  });

  it('should filter leads in a campaign by name', async () => {
    // Adiciona dois leads com nomes distintos
    await prisma.leadCampaign.createMany({
      data: [
        { campaignId, leadId, status: 'New' },
        { campaignId, leadId: secondLeadId, status: 'New' }
      ]
    });
    await prisma.lead.update({ where: { id: leadId }, data: { name: 'Filtro Lead' } });
  
    const res = await request(app)
      .get(`/api/campaigns/${campaignId}/leads?name=Filtro`)
      .expect(200);
  
    expect(res.body.leads.length).toBe(1);
    expect(res.body.leads[0].name).toBe('Filtro Lead');
  });
  
  it('should paginate leads in a campaign', async () => {
    // Adiciona vários leads à campanha
    const extraLeads = [];
    for (let i = 0; i < 5; i++) {
      const l = await prisma.lead.create({
        data: {
          name: `PagLead${i}`,
          email: `paglead${i}@mail.com`,
          phone: `0000${i}`,
          status: 'New'
        }
      });
      extraLeads.push(l.id);
      await prisma.leadCampaign.create({
        data: { campaignId, leadId: l.id, status: 'New' }
      });
    }
  
    const res = await request(app)
      .get(`/api/campaigns/${campaignId}/leads?page=2&pageSize=2`)
      .expect(200);
  
    expect(Array.isArray(res.body.leads)).toBe(true);
    expect(res.body.leads.length).toBe(2);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.page).toBe(2);
    expect(res.body.meta.pageSize).toBe(2);
  
    // Limpeza dos extras
    await prisma.leadCampaign.deleteMany({ where: { leadId: { in: extraLeads } } });
    await prisma.lead.deleteMany({ where: { id: { in: extraLeads } } });
  });
  
  it('should return 400 for invalid pagination params', async () => {
    await request(app)
      .get(`/api/campaigns/${campaignId}/leads?page=abc&pageSize=xyz`)
      .expect(400);
  });
  
  it('should return 400 for invalid campaignId param', async () => {
    await request(app)
      .get(`/api/campaigns/invalid/leads`)
      .expect(400);
  });   
});