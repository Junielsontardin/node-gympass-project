import { prisma } from "@/lib/prisma";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/services/factories/make-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(409).send({
        message: error.message,
      });
    }

    throw error;
  }

  return reply.status(200).send();
}

export async function get(_: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany();

  return reply.status(200).send({
    users,
  });
}
