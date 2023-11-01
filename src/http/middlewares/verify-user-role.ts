import { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(roleToValidate: "ADMIN" | "MEMBER") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (role !== roleToValidate) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
  };
}
