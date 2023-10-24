import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { GymUseCase } from "./create-gym";

let gymRepository: GymsRepository;
let gymUseCase: GymUseCase;

describe("Gym Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    gymUseCase = new GymUseCase(gymRepository);
  });

  it("should be able to create gym", async () => {
    const { gym } = await gymUseCase.execute({
      title: "JavaScript Gym",
      latitude: 0,
      longitude: 0,
      description: null,
      phone: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
