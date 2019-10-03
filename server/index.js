require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Photon } = require("@generated/photon");
const fetch = require("node-fetch");
const photon = new Photon();
const jwt = require("jsonwebtoken");
const { ApolloServer, gql } = require("apollo-server-express");
const cp = require("child_process");

const HAXCMS_OAUTH_JWT_SECRET = process.env.HAXCMS_OAUTH_JWT_SECRET;
const NETWORK = process.env.NETWORK;
const HOST = process.env.HOST;

async function main() {
  await photon.connect();
  const app = express();

  const getUserFromAuthHeader = async req => {
    try {
      if (typeof req.headers.authorization !== "undefined") {
        const access_token = req.headers.authorization.split(" ")[1];
        console.log(access_token)
        const user = jwt.verify(access_token, HAXCMS_OAUTH_JWT_SECRET);
        console.log(user)
        return user;
      }
    } catch (error) {
      console.log(error)
      return null;
    }
  };

  app.use(cors());
  app.use(bodyParser.json());

  /**
   * Allow calls from web components with cookies
   */
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    next();
  });

  const apolloServer = new ApolloServer({
    typeDefs: gql`
      type Server {
        id: String
        createdAt: String
        updatedAt: String
        user: String
        containerId: String
        url: String
      }

      type BatchDeleteResponse {
        count: Int
      }

      type Query {
        myServers: [Server]
      }
      type Mutation {
        createServer: Server
        deleteServer(containerId: String): Server
        deleteMyServers: BatchDeleteResponse
        deleteAllServers: BatchDeleteResponse
      }
    `,
    resolvers: {
      Query: {
        myServers: async (parent, args, ctx) =>
          await photon.servers.findMany({ where: { user: ctx.user.name } })
      },
      Mutation: {
        createServer: async (parent, args, ctx) => {
          const url = `${ctx.user.name}.${HOST}`;
          const containerId = createServer({ url, name: ctx.user.name });
          console.log(ctx.user.name)
          const server = await photon.servers.create({
            data: {
              user: ctx.user.name,
              containerId,
              url
            }
          });
          return server;
        },
        deleteServer: async (parent, { containerId }, ctx) =>
          await photon.servers.delete({ where: { containerId } }),
        deleteMyServers: async (parent, args, ctx) =>
          await photon.servers.deleteMany({ where: { user: ctx.user.name } }),
        deleteAllServers: async (parent, args, ctx) =>
          await photon.servers.deleteMany()
      }
    },
    context: async ({ req }) => ({
      user: await getUserFromAuthHeader(req)
      // user: { name: "heyMP" }
    })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    );
  });
}

const createServer = ({ name, url }) => {
  const command = [
    "service",
    "create",
    "--name",
    name,
    "--network",
    NETWORK,
    "--label",
    `traefik.enable=true`,
    "--label",
    `traefik.frontend.rule=Host:${url}`,
    "--label",
    `traefik.port=80`,
    "--label",
    `traefik.tags=${NETWORK}`,
    "elmsln/haxcms"
  ]
  console.log(command);
  const cpStartContainer = cp.spawnSync("docker", command);
  const output = cpStartContainer.output.toString();
  console.log(output)
  // console.log(output)
  // get the new container id from output
  const newContainerId = /([a-zA-Z0-9]{25})/g.exec(output)[0];
  return newContainerId;
};

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {});
