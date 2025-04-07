import "dotenv/config";
import { readFile } from "fs/promises";
import { Application } from "express";
import swaggerUi from "swagger-ui-express";

import { setupExpressApp } from "./expressServer.js";
import { adminAuth } from "./auth/admin.auth.js";
import { clientAuth } from "./auth/client.auth.js";
import { adminRouter } from "./controllers/admin.controller.js";
import { clientRouter } from "./controllers/client.controller.js";

const startServer = () =>
  setupExpressApp({
    express: {
      port: parseInt(process.env.PORT || "4000"),
      preInit: (app) => {
        if (process.env.NODE_ENV === "development") {
          // on development expose swagger UI for quick testing available on
          // `http://localhost:4000/api-docs-users` (for example)
          mountSwaggerUi({
            filePath: "./api/openapi-users.json",
            mountPoint: "/api-docs-users",
            app,
          });
        }
      },
      postInit: (app) => {
        app.use("/admin", adminAuth, adminRouter);
        app.use("/client", clientAuth, clientRouter);
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
