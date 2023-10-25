import { GymUseCase } from "../create-gym";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeCreateGymsUseCase() {
  const gymRepository = new PrismaGymsRepository();
  const useCase = new GymUseCase(gymRepository);

  return useCase;
}
