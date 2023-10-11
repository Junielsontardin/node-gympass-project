import fastify from "fastify"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

prisma.user.create({
    data: {
        email: "LALA",
        name: "OI"
    }
})

export const app = fastify();