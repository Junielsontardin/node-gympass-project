import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { ValidateCheckInCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidateError } from "./errors/late-check-in-validation-error";

let checkInRepository: InMemoryCheckInsRepository;
let validateCheckInCase: ValidateCheckInCase;

describe("Validate Check In Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    validateCheckInCase = new ValidateCheckInCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the check-in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await validateCheckInCase.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate an inexistent check-in", async () => {
    expect(() =>
      validateCheckInCase.execute({
        checkInId: "inexistent-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const checkIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const MOCK_TIME = 1000 * 60 * 21; // 21 minutes

    vi.advanceTimersByTime(MOCK_TIME);

    expect(() =>
      validateCheckInCase.execute({
        checkInId: checkIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidateError);
  });
});
