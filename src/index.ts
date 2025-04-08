import "dotenv/config";
import { readFile } from "fs/promises";
import { Application } from "express";
import swaggerUi from "swagger-ui-express";

import { setupExpressApp } from "./expressServer.js";
import { clientAuth } from "./auth/client.auth.js";
import * as ClientRouter from "./controllers/client.controller.js";

const startServer = () =>
  setupExpressApp({
    express: {
      port: parseInt(process.env.PORT || "4000"),
      preInit: (app) => {
        if (process.env.NODE_ENV === "development") {
          mountSwaggerUi({
            filePath: "./api/openapi-clients.json",
            mountPoint: "/api-docs-clients",
            app,
          });
        }
      },
      postInit: (app) => {
        app.use("/client", clientAuth, ClientRouter.router.baseRouter());
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
