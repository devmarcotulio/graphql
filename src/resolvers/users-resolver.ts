import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { prismaClient } from "../database/prisma-client";
import { hash } from "bcryptjs";
import { UserModel } from "../dtos/inputs/models/user-model";
import { CreateUserInput } from "../dtos/inputs/create-user";
import { UpdateUserInput } from "../dtos/inputs/update-user";

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

  @Mutation(() => String) 
  async update(@Arg('data') data: UpdateUserInput) {
  
    const { id, email, password } = data;
    
    const userExists = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new Error("Usuário não encontrado!");
    }

    if (userExists.email == email) {
      throw new Error("O e-mail não pode ser o mesmo!")
    }

    await prismaClient.user.updateMany({
      data: {
        email, password
      },
      where: {
        id,
      },
    });

    return `Usuário: ${id}, alterado!`;
  }
}
