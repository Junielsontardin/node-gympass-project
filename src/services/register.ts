import { UserRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUseCaseParams {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, name, password }: RegisterUseCaseParams) {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.userRepository.create({
      email,
      name,
      password_hash,
    });

    return {
      user,
    };
  }
}
