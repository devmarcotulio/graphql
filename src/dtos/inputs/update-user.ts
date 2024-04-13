import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateUserInput {

  @Field()
  id: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
