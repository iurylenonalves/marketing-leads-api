import request from 'supertest';
import app from '../../app';
import { prisma } from '../../database';

describe('Leads E2E CRUD', () => {
  let leadId: number;

  afterEach(async () => {
    if (leadId) {
      await prisma.lead.delete({ where: { id: leadId } }).catch(() => {});
      leadId = 0;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new lead', async () => {
    const timestamp = Date.now();
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: `Lead Test ${timestamp}`,
        email: `lead${timestamp}@mail.com`,
        phone: '123456789',
        status: 'New'
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toContain('Lead Test');
    leadId = res.body.id;
  });

  it('should list leads', async () => {
    const timestamp = Date.now();
    const lead = await prisma.lead.create({
      data: {
        name: `Lead List ${timestamp}`,
        email: `list${timestamp}@mail.com`,
        phone: '987654321',
        status: 'New'
      }
    });
    leadId = lead.id;

    const res = await request(app)
      .get('/api/leads')
      .expect(200);

    expect(Array.isArray(res.body.leads)).toBe(true);
    expect(res.body.leads.some((l: any) => l.id === leadId)).toBe(true);
  });

  it('should get a lead by id', async () => {
    const timestamp = Date.now();
    const lead = await prisma.lead.create({
      data: {
        name: `Lead ById ${timestamp}`,
        email: `byid${timestamp}@mail.com`,
        phone: '111222333',
        status: 'New'
      }
    });
    leadId = lead.id;

    const res = await request(app)
      .get(`/api/leads/${leadId}`)
      .expect(200);

    expect(res.body.id).toBe(leadId);
    expect(res.body.name).toContain('Lead ById');
  });

  it('should update a lead', async () => {
    const timestamp = Date.now();
    const lead = await prisma.lead.create({
      data: {
        name: `Lead Update ${timestamp}`,
        email: `update${timestamp}@mail.com`,
        phone: '444555666',
        status: 'New'
      }
    });
    leadId = lead.id;

    const res = await request(app)
      .put(`/api/leads/${leadId}`)
      .send({ name: 'Lead Updated' })
      .expect(200);

    expect(res.body.name).toBe('Lead Updated');
  });

  it('should delete a lead', async () => {
    const timestamp = Date.now();
    const lead = await prisma.lead.create({
      data: {
        name: `Lead Delete ${timestamp}`,
        email: `delete${timestamp}@mail.com`,
        phone: '777888999',
        status: 'New'
      }
    });
    leadId = lead.id;

    await request(app)
      .delete(`/api/leads/${leadId}`)
      .expect(200);

    const deleted = await prisma.lead.findUnique({ where: { id: leadId } });
    expect(deleted).toBeNull();
    leadId = 0;
  });

  it('should filter leads by name', async () => {
    const lead = await prisma.lead.create({
      data: {
        name: 'Filtro Lead',
        email: `filtro${Date.now()}@mail.com`,
        phone: '123',
        status: 'New'
      }
    });
    leadId = lead.id;

    const res = await request(app)
      .get('/api/leads?name=Filtro')
      .expect(200);

    expect(res.body.leads.length).toBeGreaterThanOrEqual(1);
    expect(res.body.leads[0].name).toContain('Filtro');
  });

  it('should paginate leads', async () => {
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
    }

    const res = await request(app)
      .get('/api/leads?page=2&pageSize=2')
      .expect(200);

    expect(Array.isArray(res.body.leads)).toBe(true);
    expect(res.body.leads.length).toBe(2);
    expect(res.body.meta.page).toBe(2);
    expect(res.body.meta.pageSize).toBe(2);

    // Limpeza dos extras
    await prisma.lead.deleteMany({ where: { id: { in: extraLeads } } });
  });

  it('should return 400 for invalid pagination params', async () => {
    await request(app)
      .get('/api/leads?page=abc&pageSize=xyz')
      .expect(400);
  });
});