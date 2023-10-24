import { CheckInsRepository } from "@/repositories/check-in-repository";

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string;
  page: number;
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({ userId, page }: FetchUserCheckInsHistoryUseCaseRequest) {
    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page,
    );

    return {
      checkIns,
    };
  }
}
