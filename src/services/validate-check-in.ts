import { CheckInsRepository } from "@/repositories/check-in-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { LateCheckInValidateError } from "./errors/late-check-in-validation-error";

interface ValidateCheckInCaseRequest {
  checkInId: string;
}

export class ValidateCheckInCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({ checkInId }: ValidateCheckInCaseRequest) {
    const checkIn = await this.checkInRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes",
    );

    const LIMIT_TIME_TO_VALIDATE_CHECK_IN = 20; // 20 minutes

    if (
      distanceInMinutesFromCheckInCreation > LIMIT_TIME_TO_VALIDATE_CHECK_IN
    ) {
      throw new LateCheckInValidateError(LIMIT_TIME_TO_VALIDATE_CHECK_IN);
    }

    checkIn.validated_at = new Date();

    await this.checkInRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
