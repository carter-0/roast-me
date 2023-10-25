import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma: PrismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['error'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
