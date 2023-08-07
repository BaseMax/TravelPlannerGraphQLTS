import { User } from "src/user/entities/user.entity";

export function getFakeUsers(): User[] {
  return [
    {
      name: "john",
      email: "test@gmail.com",
      password: "test",
      createdAt: new Date(),
    },
    {
      name: "john",
      email: "test2@gmail.com",
      password: "test",
      createdAt: new Date(),
    },
  ];
}
