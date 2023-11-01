import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Check-In (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a check-in", async () => {
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

    const response = await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: 0,
        longitude: 0,
      });

    expect(response.statusCode).toEqual(201);
  });
});
