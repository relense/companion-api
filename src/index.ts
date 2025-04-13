import "dotenv/config";
import { readFile } from "fs/promises";
import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import { setupExpressApp } from "./expressServer.js";
import { clientAuth } from "./auth/client.auth.js";
import * as ClientRouter from "./controllers/client.controller.js";
import * as PublicRouter from "./controllers/public.controller.js";
import { publicAuth } from "./auth/public.auth.js";

const startServer = () =>
  setupExpressApp({
    express: {
      port: parseInt(process.env.PORT || "4000"),
      preInit: (app) => {
        if (process.env.NODE_ENV === "development") {
          mountSwaggerUi({
            filePath: "./api/openapi-client.json",
            mountPoint: "/api-docs-client",
            app,
          });
          mountSwaggerUi({
            filePath: "./api/openapi-openai.json",
            mountPoint: "/api-docs-openai",
            app,
          });
        }
      },
      postInit: (app) => {
        app.use(
          cors({
            origin: "http://localhost:3000",
            credentials: true,
          })
        );
        app.use("/api", clientAuth, ClientRouter.router.baseRouter());
        app.use("/openai", publicAuth, PublicRouter.router.baseRouter());
      },
    },
  });

startServer().catch((err: Error) => {
  console.error(err);
  process.exit(-1);
});

async function mountSwaggerUi(params: {
  filePath: string;
  mountPoint: string;
  app: Application;
}) {
  const file = await readFile(new URL(params.filePath, import.meta.url));
  const json = JSON.parse(file.toString());
  params.app.use(
    params.mountPoint,
    swaggerUi.serveFiles(json),
    swaggerUi.setup(json)
  );
}
