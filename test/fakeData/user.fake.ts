import { User } from "src/user/entities/user.entity";

export function getFakeUser(): User {
  return {
    name: "john",
    email: "test@gmail.com",
    password: "test",
    createdAt: new Date(),
  };
}
