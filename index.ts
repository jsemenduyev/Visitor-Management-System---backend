import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import cors, { CorsOptions } from "cors";
import multer from "multer";
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
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const PORT = Number(process.env.PORT) || 3000;

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://swiped-dash.vercel.app",
  "https://swipedmax-website.vercel.app",
  "https://swiped-visit-us.vercel.app",
  "https://access.maximalsecurityservices.com",
];

const configuredAllowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const allowedOrigins = [
  ...new Set([...defaultAllowedOrigins, ...configuredAllowedOrigins]),
];

/** Private LAN hosts used when opening the Next app via Network URL (not localhost). */
const isLocalNetworkOrigin = (origin: string): boolean => {
  try {
    const url = new URL(origin);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const host = url.hostname;
    if (host === "localhost" || host === "127.0.0.1") return true;
    // 10.x.x.x, 192.168.x.x, 172.16-31.x.x
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (
      /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const allowLocalNetworkCors =
  process.env.NODE_ENV !== "production" ||
  process.env.ALLOW_LOCAL_NETWORK_CORS === "true";

console.log("Allowed CORS origins:", allowedOrigins);
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin (Postman, curl, mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }

    const normalized = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalized)) {
      return callback(null, true);
    }

    if (allowLocalNetworkCors && isLocalNetworkOrigin(normalized)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Apollo-Require-Preflight",
    "X-Apollo-Operation-Name",
  ],

  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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

  const emailConfigured = Boolean(
    process.env.EMAIL_USER?.trim() && process.env.EMAIL_PASS?.trim(),
  );
  console.log(
    `Email config: ${emailConfigured ? "configured" : "MISSING — emails will fail"}`,
  );
  console.log(
    `Verify link base URL (FRONTEND_URL): ${process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:3000"}`,
  );
  const { getContactLessBaseUrl } = await import("./src/utils/contactLessQr");
  console.log(`Contactless / QR base URL: ${getContactLessBaseUrl() || "(not configured)"}`);

  app.get("/", (_req: Request, res: Response) => {
    res.status(200).send("Hello from TypeScript Express backend 🚀");
  });


  app.use("/", verifyUserRoute);
  app.use("/", visitUsRouter);

  const uploadRoutes = ["/upload", "/api/upload", "/api/api/upload"];
  uploadRoutes.forEach((route) => {
    app.post(route, upload.single("file"), imgUpload);
  });

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

      if ((error as Error & { code?: string }).code === "LIMIT_FILE_SIZE") {
        res.status(413).json({
          success: false,
          message: "Uploaded file must be 10 MB or smaller",
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
