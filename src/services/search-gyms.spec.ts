import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymRepository: InMemoryGymsRepository;
let searchGymUseCase: SearchGymsUseCase;

describe("Search Gym Use Case", () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository();
    searchGymUseCase = new SearchGymsUseCase(gymRepository);
  });

  it("should be able to search gym by title", async () => {
    await gymRepository.create({
      title: "JavaScript Gym",
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null,
    });

    await gymRepository.create({
      title: "TypeScript Gym",
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null,
    });

    const { gyms } = await searchGymUseCase.execute({
      query: "JavaScript Gym",
      page: 1,
    });

    expect(gyms).toHaveLength(1);

    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" }),
    ]);
  });

  it("should be able to fecth paginated gyms", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `JavaScript Gym ${i}`,
        latitude: 0,
        longitude: 0,
        description: null,
        phone: null,
      });
    }

    const { gyms } = await searchGymUseCase.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);

    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  });
});
