import { CheckInsRepository } from "@/repositories/check-in-repository";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
}

export class CheckInUseCase {
  private checkInRepository: CheckInsRepository;

  constructor(checkInRepository: CheckInsRepository) {
    this.checkInRepository = checkInRepository;
  }

  async execute({ userId, gymId }: CheckInUseCaseRequest) {
    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return {
      checkIn,
    };
  }
}
