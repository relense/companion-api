import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const name = process.argv[2] || "openapi-client";
const inputFile = `${name}.json`;
const outputFile = `${name}.d.ts`;

const specPath = path.join(__dirname, "../api", inputFile);
const outputPath = path.join(__dirname, "../api", outputFile);

const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));

function toNamespace(operationId: string): string {
  return operationId[0].toUpperCase() + operationId.slice(1);
}

interface SchemaObject {
  type?: string | string[];
  enum?: string[];
  nullable?: boolean;
  items?: SchemaObject;
  properties?: Record<string, SchemaObject>;
  required?: string[];
}

function getType(schema: SchemaObject | undefined): string {
  if (!schema) return "any";

  // Handle multiple types like ["string", "null"]
  if (Array.isArray(schema.type)) {
    return schema.type
      .map((t) => (t === "null" ? "null" : getType({ type: t })))
      .join(" | ");
  }

  // Handle enums
  if (schema.enum) {
    return schema.enum.map((v) => `'${v}'`).join(" | ");
  }

  // Handle arrays
  if (schema.type === "array") {
    return `${getType(schema.items)}[]`;
  }

  // Handle objects
  if (schema.type === "object") {
    if (schema.properties) {
      const props = Object.entries(schema.properties)
        .map(([key, val]) => {
          const optional = schema.required?.includes(key) ? "" : "?";
          return `${key}${optional}: ${getType(val)};`;
        })
        .join(" ");
      return `{ ${props} }`;
    }
    return "{ [key: string]: any }";
  }

  if (schema.type && schema.nullable) {
    return `${schema.type} | null`;
  }

  // Default fallback
  return schema.type || "any";
}
const nameSpace = name.split("-")[1];

const lines: string[] = [
  `declare namespace ${
    String(nameSpace[0]).toUpperCase() + String(nameSpace).slice(1)
  }Api {`,
];

for (const [routePath, methods] of Object.entries<any>(spec.paths)) {
  for (const [method, details] of Object.entries<any>(methods)) {
    const operationId = details.operationId;
    if (!operationId) continue;

    const ns = toNamespace(operationId);
    lines.push(`  namespace ${ns} {`);

    const queryParams = (details.parameters || []).filter(
      (p: any) => p.in === "query"
    );
    const pathParams = (details.parameters || []).filter(
      (p: any) => p.in === "path"
    );

    if (queryParams.length > 0) {
      lines.push("    export interface QueryParameters {");
      for (const param of queryParams) {
        const type = getType(param.schema);
        lines.push(`      ${param.name}${param.required ? "" : "?"}: ${type};`);
      }
      lines.push("    }");
    } else {
      lines.push("    export type QueryParameters = {};");
    }

    if (pathParams.length > 0) {
      lines.push("    export interface PathParameters {");
      for (const param of pathParams) {
        const type = getType(param.schema);
        lines.push(`      ${param.name}${param.required ? "" : "?"}: ${type};`);
      }
      lines.push("    }");
    } else {
      lines.push("    export type PathParameters = {};");
    }

    const requestBodySchema =
      details?.requestBody?.content?.["application/json"]?.schema;
    if (requestBodySchema) {
      lines.push("    export interface RequestBody {");
      for (const [prop, def] of Object.entries<any>(
        requestBodySchema.properties || {}
      )) {
        const required = requestBodySchema.required?.includes(prop);
        lines.push(`      ${prop}${required ? "" : "?"}: ${getType(def)};`);
      }
      lines.push("    }");
    } else {
      lines.push("    export type RequestBody = {};");
    }

    lines.push("    namespace Responses {");
    for (const [status, resp] of Object.entries<any>(details.responses)) {
      const respSchema = resp?.content?.["application/json"]?.schema;
      lines.push(`      export interface $${status} {`);
      if (respSchema?.properties) {
        for (const [prop, def] of Object.entries<any>(respSchema.properties)) {
          const required = respSchema.required?.includes(prop);
          lines.push(`        ${prop}${required ? "" : "?"}: ${getType(def)};`);
        }
      }
      lines.push("      }");
    }
    lines.push("    }");

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
console.log(`✅ Type declarations written to ${outputFile}`);
