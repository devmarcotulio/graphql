import { ApolloServer } from "apollo-server";
import "reflect-metadata";

async function main() {
  const server = new ApolloServer({});

  const { url } = await server.listen();

  console.log(`Server running on ${url}`);
}

main();
