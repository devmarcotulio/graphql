import { Query, Resolver } from "type-graphql";

@Resolver()
export class UsersResolver {

  @Query(() => String)
  async create() {}
}
