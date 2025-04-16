import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.lead.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        status: 'New'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-5678',
        status: 'Contacted'
      }
    ],
    skipDuplicates: true,
  });

  await prisma.group.createMany({
    data: [
      {
        name: 'VIP Customers',
        description: 'High-value prospects'
      },
      {
        name: 'Newsletter Subscribers',
        description: 'Leads from newsletter signup'
      }
    ],
    skipDuplicates: true,
  });

  await prisma.campaign.createMany({
    data: [
      {
        name: 'Summer Sale 2025',
        description: 'Promotional campaign for summer products',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-08-31')
      },
      {
        name: 'New Year Campaign',
        description: 'Celebrate the new year with discounts',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-15')
      }
    ],
    skipDuplicates: true,
  });

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });