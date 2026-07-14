import express, { Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import initializeApolloServer from "./initGraphQLServer";
import { expressMiddleware } from "@apollo/server/express4";
import initiateMongoServer from "./database/db";
import { parseJwt } from "./src/services/authJwt";
import imgUpload from "./src/services/imgUpload";
import updateVisitorResolver from "./src/gateway/visitor/resolver/updateVisitorResolver";
import verifyUserRoute from "./utils/verifyUser";
import googleChatRouter from "./src/services/googleChatRoute";
import { authMiddleware } from "./src/middleware/authMiddleware";
import msTeamRouter from "./src/services/msTeamRoute";
import visitUsRouter from "./src/services/visitUsRoute";
dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;
const context = async ({ req, res }) => {
  const data = await parseJwt(req);
  return {
    req,
    res,
    user: data,
  };
};
app.use(express.json());
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));
const init = async () => {
  const apolloServer = await initializeApolloServer(httpServer);
  await apolloServer.start();
  initiateMongoServer();
  // Health check
  app.get("/", async (req: Request, res: Response) => {
    res.send(`Hello from TypeScript Express + Postgres🚀`);
  });
  app.use("/", verifyUserRoute);
  app.use("/", visitUsRouter);
  app.post("/api/get-signed-url", imgUpload);
  app.get("/approveVisitor", async (req: any, res) => {
    try {
      const { visitorId } = req.query;
      console.log(visitorId, "visss");

      if (!visitorId) return res.status(400).send("Missing visitorId");

      const args = {
        input: {
          _id: visitorId || "",
          signedType: "In",
        },
      };

      await updateVisitorResolver("+", args);
      res.send(`<h3>✅ Visitor approved successfully.</h3>`);
    } catch (error) {
      res.status(500).send("Error approving visitor");
    }
  });
  app.get("/rejectVisitor", async (req: any, res) => {
    try {
      const { visitorId } = req.query;
      if (!visitorId) return res.status(400).send("Missing visitorId");

      const args = {
        input: {
          _id: visitorId || "",
          signedType: "Rejected",
        },
      };

      await updateVisitorResolver("+", args);
      res.send(`<h3>✅ Visitor reject successfully.</h3>`);
    } catch (error) {
      res.status(500).send("Error approving visitor");
    }
  });
  app.use("/api/google-chat", authMiddleware, googleChatRouter);
  app.use("/api/teams", msTeamRouter);
  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context,
    }),
  );

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};
init();
