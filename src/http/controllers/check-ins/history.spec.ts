import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("History Check-In (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get check-in history from user", async () => {
    const { token } = await createAndAuthenticateUser(app);

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
    expect(response.body.checkIns).toHaveLength(1);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: id,
      }),
    ]);
  });
});
