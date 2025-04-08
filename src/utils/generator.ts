import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ⛏ Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const specPath = path.join(__dirname, "../api/openapi-client.json");
const outputPath = path.join(__dirname, "../api/openapi-client.d.ts");

// Load and parse OpenAPI JSON
const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));

function toNamespace(operationId: string): string {
  return operationId[0].toUpperCase() + operationId.slice(1);
}

const lines: string[] = ["declare namespace CompanionApi {"];

for (const [routePath, methods] of Object.entries<any>(spec.paths)) {
  for (const [method, details] of Object.entries<any>(methods)) {
    const operationId = details.operationId;
    if (!operationId) continue;

    const ns = toNamespace(operationId);
    lines.push(`  namespace ${ns} {`);

    // --- Parameters (Query + Path) ---
    const queryParams = (details.parameters || []).filter(
      (p: any) => p.in === "query"
    );
    const pathParams = (details.parameters || []).filter(
      (p: any) => p.in === "path"
    );

    if (queryParams.length > 0) {
      lines.push("    export interface QueryParameters {");
      for (const param of queryParams) {
        const type = param.schema?.type || "string";
        lines.push(`      ${param.name}${param.required ? "" : "?"}: ${type};`);
      }
      lines.push("    }");
    } else {
      lines.push("    export type QueryParameters = {};");
    }

    if (pathParams.length > 0) {
      lines.push("    export interface PathParameters {");
      for (const param of pathParams) {
        const type = param.schema?.type || "string";
        lines.push(`      ${param.name}${param.required ? "" : "?"}: ${type};`);
      }
      lines.push("    }");
    } else {
      lines.push("    export type PathParameters = {};");
    }

    // --- Request Body ---
    const requestBodySchema =
      details?.requestBody?.content?.["application/json"]?.schema;
    if (requestBodySchema && requestBodySchema.properties) {
      lines.push("    export interface RequestBody {");
      for (const [prop, def] of Object.entries<any>(
        requestBodySchema.properties
      )) {
        const required = requestBodySchema.required?.includes(prop);
        lines.push(`      ${prop}${required ? "" : "?"}: ${def.type};`);
      }
      lines.push("    }");
    } else {
      lines.push("    export type RequestBody = {};");
    }

    // --- Responses ---
    lines.push("    namespace Responses {");
    for (const [status, resp] of Object.entries<any>(details.responses)) {
      const respSchema = resp?.content?.["application/json"]?.schema;
      lines.push(`      export interface $${status} {`);
      if (respSchema?.properties) {
        for (const [prop, def] of Object.entries<any>(respSchema.properties)) {
          const required = respSchema.required?.includes(prop);
          lines.push(`        ${prop}${required ? "" : "?"}: ${def.type};`);
        }
      }
      lines.push("      }");
    }
    lines.push("    }");

    // --- Config Interface ---
    const firstResponse = Object.keys(details.responses)[0];
    const responseUnion = Object.keys(details.responses)
      .map((code) => `Responses.$${code}`)
      .join(" | ");

    lines.push("    export interface Config {");
    lines.push(`      operationId: \"${operationId}\";`);
    lines.push(`      method: \"${method}\";`);
    lines.push(
      `      expressPath: \"${routePath
        .replace(/{/g, ":")
        .replace(/}/g, "")}\";`
    );
    lines.push(`      openapiPath: \"${routePath}\";`);
    lines.push("      pathParams: PathParameters;");
    lines.push("      queryParams: QueryParameters;");
    lines.push("      requestBody: RequestBody;");
    lines.push("      headers?: any;");
    lines.push(`      responses: ${responseUnion};`);
    lines.push(`      successResponses: Responses.$${firstResponse};`);
    lines.push("    }");

    lines.push("  }");
  }
}

lines.push("}");

fs.writeFileSync(outputPath, lines.join("\n"), "utf-8");
console.log("✅ Type declarations written to openapi-client.d.ts");
