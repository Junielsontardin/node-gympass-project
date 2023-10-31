import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to fetch nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TypeScript Gym",
        description: null,
        phone: null,
        latitude: -22.2625792,
        longitude: -42.51648,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: null,
        phone: null,
        latitude: 0,
        longitude: 0,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: 0,
        longitude: 0,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript Gym",
      }),
    ]);
  });
});
