import "dotenv/config";
import { setupExpressApp } from "./expressServer.js";
import { adminAuth } from "./auth/admin.auth.js";
import { clientAuth } from "./auth/client.auth.js";
import { adminRouter } from "./controllers/admin.controller.js";
import { clientRouter } from "./controllers/client.controller.js";
const startServer = () => setupExpressApp({
    express: {
        port: parseInt(process.env.PORT || "4000"),
        routes: (app) => {
            app.use("/admin", adminAuth, adminRouter);
            app.use("/client", clientAuth, clientRouter);
        },
    },
});
startServer().catch((err) => {
    console.error(err);
    process.exit(-1);
});
