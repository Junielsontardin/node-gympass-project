import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CheckInUseCase } from "../check-in";

export function makeCheckInUseCase() {
  const gymRepository = new PrismaGymsRepository();
  const checkInRepository = new PrismaCheckInsRepository();
  const useCase = new CheckInUseCase(checkInRepository, gymRepository);

  return useCase;
}
