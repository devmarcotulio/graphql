import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput } from "../dtos/inputs/create-user";
import { prismaClient } from "../database/prisma-client";
import { UserModel } from "../dtos/inputs/models/user-model";
import { hash } from "bcryptjs";

@Resolver()
export class UsersResolver {

  @Query(() => [UserModel])
  async list() {
    return await prismaClient.user.findMany();
  }

  @Mutation(() => UserModel)
  async create(@Arg('data') data: CreateUserInput) {

    const { email, password } = data;

    const emailExists = await prismaClient.user.findFirst({
      where: {
        email
      }
    })

    if (emailExists) {
      throw new Error("Email já cadastrado!");
    }

    const hashedPassword = await hash(password, 8)

    return await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword
      },
    });
  }

  @Mutation(() => String)
  async delete(@Arg('id') id: string) {

    const userExists = await prismaClient.user.findUnique({
      where: {
        id
      }
    });

    if (!userExists) {
      throw new Error("Usuário não encontrado!");
    }

    const deleted = await prismaClient.user.delete({
      where: {
        id
      }
    });

    return `Usuário: ${deleted.id}, deletado!`
  }
}
