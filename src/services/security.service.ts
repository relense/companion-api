import { Errors } from "../utils/errors.js";

type SecurityContext<T extends "CLIENT" | "ADMIN" | "PUBLIC"> =
  | ({ type: "CLIENT"; userId: string } & { type: T })
  | ({ type: "ADMIN"; userId: string } & { type: T })
  | ({ type: "PUBLIC" } & { type: T });

function assertAdminContext(context: SecurityContext<"ADMIN">) {
  if (context.type === "ADMIN") {
    return context;
  } else {
    throw Errors.forbidden();
  }
}

function assertClientContext(context: SecurityContext<"CLIENT">) {
  if (context.type === "CLIENT") {
    return context;
  } else {
    throw Errors.forbidden();
  }
}

function assertPublicContext(context: SecurityContext<"PUBLIC">) {
  if (context.type === "PUBLIC") {
    return context;
  } else {
    throw Errors.forbidden();
  }
}

const securityService = {
  assertAdminContext,
  assertClientContext,
  assertPublicContext,
};

export { securityService, SecurityContext };
