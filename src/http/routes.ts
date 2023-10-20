import { FastifyInstance } from "fastify";
import { get, register } from "./controllers/register";
import { authenticate } from "./controllers/authenticate";

export async function appRoutes(app: FastifyInstance) {
  app.get("/users", get);

  app.post("/users", register);

  app.post("/sessions", authenticate);
}
