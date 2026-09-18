import 'dotenv/config';
import { PrismaClient } from '../../node_modules/.prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

 