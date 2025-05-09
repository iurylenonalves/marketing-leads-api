import request from 'supertest';
import app from '../../app';
import { prisma } from '../../database';

describe('GroupLeads E2E', () => {
  let groupId: number;
  let leadId: number;
  let secondLeadId: number;

  beforeEach(async () => {
    // Cria um grupo e dois leads para os testes
    const timestamp = Date.now();
    const group = await prisma.group.create({
      data: {
        name: `Group Test ${timestamp}`,
        description: 'Test group'
      }
    });
    groupId = group.id;

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
    await prisma.$executeRaw`DELETE FROM "_GroupLeads" WHERE "A" = ${groupId}`;
    await prisma.group.delete({ where: { id: groupId } }).catch(() => {});
    await prisma.lead.delete({ where: { id: leadId } }).catch(() => {});
    await prisma.lead.delete({ where: { id: secondLeadId } }).catch(() => {});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should add a lead to a group', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/leads`)
      .send({ leadId })
      .expect(201);

    expect(res.body.leads.some((l: any) => l.id === leadId)).toBe(true);
  });

  it('should list leads in a group', async () => {
    // Adiciona os dois leads ao grupo
    await prisma.group.update({
      where: { id: groupId },
      data: { leads: { connect: [{ id: leadId }, { id: secondLeadId }] } }
    });

    const res = await request(app)
      .get(`/api/groups/${groupId}/leads`)
      .expect(200);

    expect(Array.isArray(res.body.leads)).toBe(true);
    expect(res.body.leads.length).toBeGreaterThanOrEqual(2);
    expect(res.body.leads.some((l: any) => l.id === leadId)).toBe(true);
    expect(res.body.leads.some((l: any) => l.id === secondLeadId)).toBe(true);
  });

  it('should remove a lead from a group', async () => {
    // Adiciona o lead ao grupo
    await prisma.group.update({
      where: { id: groupId },
      data: { leads: { connect: { id: leadId } } }
    });

    const res = await request(app)
      .delete(`/api/groups/${groupId}/leads/${leadId}`)
      .expect(200);

    expect(res.body.leads.some((l: any) => l.id === leadId)).toBe(false);
  });

  it('should not add the same lead twice', async () => {
    await request(app)
      .post(`/api/groups/${groupId}/leads`)
      .send({ leadId })
      .expect(201);

    await request(app)
      .post(`/api/groups/${groupId}/leads`)
      .send({ leadId })
      .expect(409); // Conflito
  });

  it('should return 404 for non-existent group or lead', async () => {
    await request(app)
      .post(`/api/groups/999999/leads`)
      .send({ leadId })
      .expect(404);

    await request(app)
      .post(`/api/groups/${groupId}/leads`)
      .send({ leadId: 999999 })
      .expect(404);
  });

  it('should filter leads in a group by name', async () => {
    const lead = await prisma.lead.create({
      data: {
        name: 'Filtro Lead',
        email: `filtro${Date.now()}@mail.com`,
        phone: '123',
        status: 'New'
      }
    });
    await prisma.group.update({
      where: { id: groupId },
      data: { leads: { connect: { id: lead.id } } }
    });

    const res = await request(app)
      .get(`/api/groups/${groupId}/leads?name=Filtro`)
      .expect(200);

    expect(res.body.leads.length).toBeGreaterThanOrEqual(1);
    expect(res.body.leads[0].name).toContain('Filtro');
    await prisma.lead.delete({ where: { id: lead.id } });
  });

  it('should paginate leads in a group', async () => {
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
      await prisma.group.update({
        where: { id: groupId },
        data: { leads: { connect: { id: l.id } } }
      });
    }

    const res = await request(app)
      .get(`/api/groups/${groupId}/leads?page=2&pageSize=2`)
      .expect(200);

    expect(Array.isArray(res.body.leads)).toBe(true);
    expect(res.body.leads.length).toBe(2);
    expect(res.body.meta.page).toBe(2);
    expect(res.body.meta.pageSize).toBe(2);

    // Limpeza dos extras
    await prisma.group.update({
      where: { id: groupId },
      data: { leads: { disconnect: extraLeads.map(id => ({ id })) } }
    });
    await prisma.lead.deleteMany({ where: { id: { in: extraLeads } } });
  });

  it('should return 400 for invalid pagination params', async () => {
    await request(app)
      .get(`/api/groups/${groupId}/leads?page=abc&pageSize=xyz`)
      .expect(400);
  });

  it('should return 400 for invalid groupId param', async () => {
    await request(app)
      .get(`/api/groups/invalid/leads`)
      .expect(400);
  });
});