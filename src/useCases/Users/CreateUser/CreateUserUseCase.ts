import { User } from "../../../entities/User";
import { IUsersRepository } from "../../../repositories/IUsersRepository";

interface ICreateUserRequest {
  name: string;
  image: string;
  type: string;
}

export class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(data: ICreateUserRequest) {
    const userExists = await this.usersRepository.findByName(data.name);

    if (userExists) {
      throw new Error(`User ${data.name} already exists`);
    }

    const user = new User(data);

    await this.usersRepository.save(user);
  }
}
