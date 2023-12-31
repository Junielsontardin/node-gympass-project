import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let userRepository: InMemoryUsersRepository;
let authenticateUseCase: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUseCase(userRepository);
  });

  it("should be able to authenticate", async () => {
    await userRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password_hash: await hash("123456", 6),
    });

    const { user } = await authenticateUseCase.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await userRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      authenticateUseCase.execute({
        email: "johndoee@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await userRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      authenticateUseCase.execute({
        email: "johndoe@example.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
