import swaggerJSDoc from "swagger-jsdoc";
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Outreach Companion API",
            version: "1.0.0",
            description: "API documentation for your AI-powered cold outreach agent",
        },
        servers: [
            {
                url: "http://localhost:3000", // Adjust this for prod
            },
        ],
    },
    apis: ["./controllers/*.ts"], // Scan route files for JSDoc annotations
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
