import { User } from "@prisma/client";
import { userResponseSchema, UserResponse } from "~/schemas/user.schema";

export class UserMapper {
  static toHTTP(user: User): UserResponse {
    //zod remove password_hash and format dates
    return userResponseSchema.parse(user);
  }

  //for user list
  static toHTTPList(users: User[]): UserResponse[] {
    return users.map((user) => this.toHTTP(user));
  }
}
