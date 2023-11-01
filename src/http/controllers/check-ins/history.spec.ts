import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterEach, beforeEach } from "node:test";

describe("History Check-In (e2e)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  beforeAll(async () => {
    await app.ready();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get check-in history from user", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const gymResponse = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: null,
        phone: null,
        latitude: 0,
        longitude: 0,
      });

    const { id } = gymResponse.body.gym;

    vi.setSystemTime(new Date(2020, 0, 20, 8, 0, 0));

    await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: 0,
        longitude: 0,
      });

    vi.setSystemTime(new Date(2020, 0, 21, 8, 0, 0));

    await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: 0,
        longitude: 0,
      });

    const response = await request(app.server)
      .get("/check-ins/history")
      .query({
        page: 1,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toHaveLength(2);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: id,
      }),
      expect.objectContaining({
        gym_id: id,
      }),
    ]);
  });
});
