import "dotenv/config";
import { readFile } from "fs/promises";
import swaggerUi from "swagger-ui-express";
import { setupExpressApp } from "./expressServer.js";
import { adminAuth } from "./auth/admin.auth.js";
import { clientAuth } from "./auth/client.auth.js";
import { adminRouter } from "./controllers/admin.controller.js";
import { clientRouter } from "./controllers/client.controller.js";
const startServer = () => setupExpressApp({
    express: {
        port: parseInt(process.env.PORT || "4000"),
        postInit: (app) => {
            app.use("/admin", adminAuth, adminRouter);
            app.use("/client", clientAuth, clientRouter);
        },
    },
});
startServer().catch((err) => {
    console.error(err);
    process.exit(-1);
});
async function mountSwaggerUi(params) {
    const file = await readFile(new URL(params.filePath, import.meta.url));
    const json = JSON.parse(file.toString());
    params.app.use(params.mountPoint, swaggerUi.serveFiles(json), swaggerUi.setup(json));
}
