import request from 'supertest';
import app from '../../app';
import { prisma } from '../../database';

describe('Groups E2E CRUD', () => {
  let groupId: number;

  afterEach(async () => {
    if (groupId) {
      await prisma.group.delete({ where: { id: groupId } }).catch(() => {});
      groupId = 0;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new group', async () => {
    const timestamp = Date.now();
    const res = await request(app)
      .post('/api/groups')
      .send({
        name: `Group Test ${timestamp}`,
        description: 'Test group'
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toContain('Group Test');
    groupId = res.body.id;
  });

  it('should list groups', async () => {
    const timestamp = Date.now();
    const group = await prisma.group.create({
      data: {
        name: `Group List ${timestamp}`,
        description: 'List group'
      }
    });
    groupId = group.id;

    const res = await request(app)
      .get('/api/groups')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((g: any) => g.id === groupId)).toBe(true);
  });

  it('should get a group by id', async () => {
    const timestamp = Date.now();
    const group = await prisma.group.create({
      data: {
        name: `Group ById ${timestamp}`,
        description: 'ById group'
      }
    });
    groupId = group.id;

    const res = await request(app)
      .get(`/api/groups/${groupId}`)
      .expect(200);

    expect(res.body.id).toBe(groupId);
    expect(res.body.name).toContain('Group ById');
  });

  it('should update a group', async () => {
    const timestamp = Date.now();
    const group = await prisma.group.create({
      data: {
        name: `Group Update ${timestamp}`,
        description: 'Update group'
      }
    });
    groupId = group.id;

    const res = await request(app)
      .put(`/api/groups/${groupId}`)
      .send({ name: 'Group Updated' })
      .expect(200);

    expect(res.body.name).toBe('Group Updated');
  });

  it('should delete a group', async () => {
    const timestamp = Date.now();
    const group = await prisma.group.create({
      data: {
        name: `Group Delete ${timestamp}`,
        description: 'Delete group'
      }
    });
    groupId = group.id;

    await request(app)
      .delete(`/api/groups/${groupId}`)
      .expect(200);

    const deleted = await prisma.group.findUnique({ where: { id: groupId } });
    expect(deleted).toBeNull();
    groupId = 0;
  });

  it('should filter groups by name', async () => {
    const group = await prisma.group.create({
      data: {
        name: 'Filtro Group',
        description: 'desc'
      }
    });
    groupId = group.id;

    const res = await request(app)
      .get('/api/groups?name=Filtro')
      .expect(200);

    console.log(res.body);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body.some((g: any) => g.name.includes('Filtro'))).toBe(true);
    });

  // it('should paginate groups', async () => {
  //   const extraGroups = [];
  //   const timestamp = Date.now();
  //   for (let i = 0; i < 5; i++) {
  //     const g = await prisma.group.create({
  //       data: {
  //         name: `PagGroup${i}_${timestamp}`,
  //         description: 'desc'
  //       }
  //     });
  //     extraGroups.push(g.id);
  //   }

  //   const res = await request(app)
  //     .get('/api/groups?page=2&pageSize=2')
  //     .expect(200);

  //   expect(Array.isArray(res.body)).toBe(true);
  //   expect(res.body.length).toBe(2);
  //   //expect(res.body.meta.page).toBe(2);
  //   //expect(res.body.meta.pageSize).toBe(2);

  //   // Limpeza dos extras
  //   await prisma.group.deleteMany({ where: { id: { in: extraGroups } } });
  // });

  // it('should return 400 for invalid pagination params', async () => {
  //   await request(app)
  //     .get('/api/groups?page=abc&pageSize=xyz')
  //     .expect(400);
  // });
})