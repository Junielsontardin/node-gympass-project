import { GymsRepository } from "@/repositories/gyms-repository";

interface SearchGymsUseCaseRequest {
  query: string;
  page: number;
}

export class SearchGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({ query, page }: SearchGymsUseCaseRequest) {
    const gyms = await this.gymRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}
