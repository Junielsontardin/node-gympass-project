import { CheckInsRepository } from "@/repositories/check-in-repository";

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

export class GetUserMetricsUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({ userId }: GetUserMetricsUseCaseRequest) {
    const checkInsCount = await this.checkInRepository.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}
