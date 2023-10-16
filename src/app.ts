import fastify from "fastify"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

prisma.user.create({
    data: {
        email: "LALA",
        name: "OII"
    }
})

export const app = fastify();