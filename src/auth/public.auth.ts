import express, { Request } from "express";

import { SecurityContext } from "../services/security.service.js";

async function buildContext(): Promise<SecurityContext<"PUBLIC">> {
  return {
    type: "PUBLIC",
  };
}

async function publicAuth(
  req: Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    req.context = await buildContext();

    next();
  } catch (error) {
    next(error);
  }
}

export { publicAuth };
