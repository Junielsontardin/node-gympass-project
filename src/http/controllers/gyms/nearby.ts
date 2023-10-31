import { makeFetchNearbyGymsUseCase } from "@/services/factories/make-fetch-nearby-gyms-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  });

  const { latitude, longitude } = nearbyQuerySchema.parse(request.query);

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ gyms });
}
