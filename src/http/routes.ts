import { FastifyInstance } from "fastify";
import { get, register } from "./controllers/register";
import { authenticate } from "./controllers/authenticate";
import { profile } from "./controllers/profile";
import { verifyJWT } from "./middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.get("/users", get);

  app.post("/users", register);
  app.post("/sessions", authenticate);

  // Routes Authenticated

  app.get("/me", { onRequest: [verifyJWT] }, profile);
}
