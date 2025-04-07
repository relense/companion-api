import express, { Request } from "express";

import { userService } from "../services/user.service.js";
import { SecurityContext } from "../services/security.service.js";
import { Errors } from "../utils/errors.js";
import { decodeHeader } from "../utils/utils.js";

async function buildContext({
  token,
}: {
  token: string;
}): Promise<SecurityContext<"CLIENT">> {
  const user = await userService.validateUser({
    userToken: token,
  });

  if (user.role !== "CLIENT") {
    throw Errors.forbidden();
  }

  return {
    type: "CLIENT",
    userId: user.id,
  };
}

async function clientAuth(
  req: Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const userApikKey = decodeHeader(req, "apikey");
    if (!userApikKey) throw Errors.unauthorized();

    req.context = await buildContext({
      token: userApikKey,
    });

    next();
  } catch (error) {
    next(error);
  }
}

export { clientAuth };
