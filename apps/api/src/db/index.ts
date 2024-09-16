import { PrismaClient } from '@prisma/client';
import multiTierCache from './extensions/multi-tier-cache';

export const db = new PrismaClient();
