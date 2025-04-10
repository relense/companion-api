import { middleware } from "express-openapi-validator";
import path from "path";
import { Router } from "express";
import { fileURLToPath } from "url";

import { securityService } from "../services/security.service.js";
import { typedRouter } from "../utils/expressUtils.js";
import { messageService } from "../services/message.service.js";
import { Message } from "../models/Message.js";
import { buildPaginatedResponse } from "../utils/paginationUtils.js";

const router = typedRouter(Router());

// Get the directory. Note that '__dirname' is not available in ESM scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.baseRouter().use(
  middleware({
    apiSpec: path.join(__dirname, "../api/openapi-client.json"),
    validateRequests: true,
    validateResponses: true,
  })
);

router.post<CompanionApi.CreateMessage.Config>(
  "/messages",
  async (req, res, next) => {
    try {
      try {
        const response = await messageService.createMessage({
          context: securityService.assertClientContext(req.context),
          message: req.body.message,
        });

        res.status(201).json(response);
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.get<CompanionApi.GetMessages.Config>(
  "/messages",
  async (req, res, next) => {
    try {
      const response = await messageService.getAllMessages({
        pagination: {
          page: req.query.page || 1,
          size: req.query.pageSize || 25,
        },
        context: securityService.assertClientContext(req.context),
      });

      res.status(200).json(
        buildPaginatedResponse({
          items: response.items
            .map(Message.fromRow)
            .map((msg) => msg.toResource()),
          total: response.itemCount,
          pagination: {
            page: req.query.page || 1,
            size: req.query.pageSize || 25,
          },
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

router.get<CompanionApi.GetMessage.Config>(
  "/messages/:messageId",
  async (req, res, next) => {
    try {
      const response = await messageService.getMessage({
        context: securityService.assertClientContext(req.context),
        messageId: req.params.messageId,
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

router.put("/messages/:messageId", async (req, res, next) => {
  try {
    res.status(200).json(undefined);
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
