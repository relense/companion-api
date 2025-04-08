import { middleware } from "express-openapi-validator";
import path from "path";

import { securityService } from "../services/security.service.js";
import { typedRouter } from "../utils/expressUtils.js";
import { messageService } from "../services/message.service.js";
import { Router } from "express";

const router = typedRouter(Router());

router.baseRouter().use(
  middleware({
    apiSpec: path.join(__dirname, "../api/openapi-admin.json"),
    validateRequests: true,
    validateResponses: false,
  })
);

router.post("/messages", async (req, res, next) => {
  try {
    try {
      const response = await messageService.createMessage({
        context: securityService.assertClientContext(req.context),
        message: req.body.message,
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/messages", async (req, res, next) => {
  try {
    const response = {};
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.get("/messages/:messageId", async (req, res, next) => {
  try {
    const response = {};
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.put("/messages/:messageId", async (req, res, next) => {
  try {
    const response = {};
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.delete("/messages/:messageId", async (req, res, next) => {
  try {
    const response = {};
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

export { router };
