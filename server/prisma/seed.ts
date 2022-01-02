import { PrismaClient, prisma } from '@prisma/client';

import bcrypt from 'bcryptjs';

const client = new PrismaClient();

const main = async () => {
  const spencer = await client.user.create({
    data: {
      name: 'spencer',
      email: 'spencer@spencer.com',
      password: await bcrypt.hash('spencer', 10),
      UserVerification: {
        create: {
          token: '1',
          verified: true
        }
      },
      Post: {
        create: [
          {
            message: 'This is my first post'
          },
          {
            message: 'This is my second post, it is much better.'
          }
        ]
      }
    }
  });

  const juan = await client.user.create({
    data: {
      name: 'juan',
      email: 'juan@juan.com',
      password: await bcrypt.hash('juan', 10),
      UserVerification: {
        create: {
          token: '1',
          verified: true
        }
      },
      Post: {
        create: [
          {
            message: 'This is my second last post'
          },
          {
            message: 'This is my last post, this is the end.'
          }
        ]
      }
    }
  });

  console.log({ spencer, juan });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await client.$disconnect());
