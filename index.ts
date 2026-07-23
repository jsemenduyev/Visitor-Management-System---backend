import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import cors, { CorsOptions } from "cors";
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

const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);
const corsOptions: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Apollo-Require-Preflight",
    "X-Apollo-Operation-Name",
  ],
  credentials: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.options("/graphql", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const context = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) => {
  const user = await parseJwt(req);

  return {
    req,
    res,
    user,
  };
};

const init = async (): Promise<void> => {

  const apolloServer = await initializeApolloServer(httpServer);
  await apolloServer.start();

  await initiateMongoServer();

  app.get("/", (_req: Request, res: Response) => {
    res.status(200).send("Hello from TypeScript Express backend 🚀");
  });


  app.use("/", verifyUserRoute);
  app.use("/", visitUsRouter);

  app.post("/api/get-signed-url", imgUpload);

  app.get("/approveVisitor", async (req: Request, res: Response) => {
    try {
      const visitorId = req.query.visitorId;

      if (typeof visitorId !== "string" || !visitorId.trim()) {
        res.status(400).send("Missing visitorId");
        return;
      }

      const args = {
        input: {
          _id: visitorId,
          signedType: "In",
        },
      };

      await updateVisitorResolver("+", args);

      res.status(200).send("<h3>✅ Visitor approved successfully.</h3>");
    } catch (error) {
      console.error("Error approving visitor:", error);
      res.status(500).send("Error approving visitor");
    }
  });

  app.get("/rejectVisitor", async (req: Request, res: Response) => {
    try {
      const visitorId = req.query.visitorId;

      if (typeof visitorId !== "string" || !visitorId.trim()) {
        res.status(400).send("Missing visitorId");
        return;
      }

      const args = {
        input: {
          _id: visitorId,
          signedType: "Rejected",
        },
      };

      await updateVisitorResolver("+", args);

      res.status(200).send("<h3>✅ Visitor rejected successfully.</h3>");
    } catch (error) {
      console.error("Error rejecting visitor:", error);
      res.status(500).send("Error rejecting visitor");
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
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });

  app.use(
    (
      error: Error,
      _req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      console.error("Unhandled server error:", error);

      if (error.message.includes("not allowed by CORS")) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    },
  );

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
};

init().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exit(1);
});