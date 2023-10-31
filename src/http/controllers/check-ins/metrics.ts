import { makeGetUserMetricsUseCase } from "@/services/factories/make-get-user-metrics-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();

  const userId = request.user.sub;

  const { checkInsCount } = await getUserMetricsUseCase.execute({
    userId,
  });

  return reply.status(200).send({
    checkInsCount,
  });
}
