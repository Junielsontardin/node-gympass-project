import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-in-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);

    return checkIns;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startsOfTheDay = dayjs(date).startOf("date");
    const endsOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDay = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnTheSameDay =
        checkInDate.isAfter(startsOfTheDay) &&
        checkInDate.isBefore(endsOfTheDay);

      return checkIn.user_id === userId && isOnTheSameDay;
    });

    if (!checkInOnSameDay) {
      return null;
    }

    return checkInOnSameDay;
  }
}
