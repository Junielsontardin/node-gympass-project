import { describe, expect, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { UserRepository } from "@/repositories/users-repository";

let userRepository: UserRepository;
let registerUseCase: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    registerUseCase = new RegisterUseCase(userRepository);
  });

  it("should be able to register", async () => {
    const { user } = await registerUseCase.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await registerUseCase.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("shouldn't registrate a user with same e-mail", async () => {
    const email = "johndoe@example.com";

    await registerUseCase.execute({
      email,
      name: "John Doe",
      password: "123456",
    });

    await expect(() =>
      registerUseCase.execute({
        email,
        name: "John Doe",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
