import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymRepository: InMemoryGymsRepository;
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository();
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymRepository.create({
      title: "Near Gym",
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null,
    });

    await gymRepository.create({
      title: "Near Gym 1",
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null,
    });

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(gyms).toHaveLength(2);

    expect(gyms).toEqual([
      expect.objectContaining({ title: "Near Gym" }),
      expect.objectContaining({ title: "Near Gym 1" }),
    ]);
  });

  it("should not be able to fetch distant gyms", async () => {
    await gymRepository.create({
      title: "Near Gym",
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null,
    });

    await gymRepository.create({
      title: "Far Gym",
      latitude: -22.2625792,
      longitude: -42.51648,
      description: null,
      phone: null,
    });

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(gyms).toHaveLength(1);

    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
    expect(gyms).toEqual([expect.not.objectContaining({ title: "Far Gym" })]);
  });
});
