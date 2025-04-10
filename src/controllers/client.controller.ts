import { middleware } from "express-openapi-validator";
import path from "path";
import { Router } from "express";
import { fileURLToPath } from "url";

import { securityService } from "../services/security.service.js";
import { typedRouter } from "../utils/expressUtils.js";
import { messageService } from "../services/message.service.js";
import { buildPaginatedResponse } from "../utils/paginationUtils.js";

const router = typedRouter(Router());

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
          items: response.items,
          total: response.itemCount,
          pagination: response.pagination,
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

router.put<CompanionApi.UpdateMessage.Config>(
  "/messages/:messageId",
  async (req, res, next) => {
    try {
      const response = await messageService.updateMessage({
        context: securityService.assertClientContext(req.context),
        messageId: req.params.messageId,
        message: req.body.messageContent,
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

router.delete<CompanionApi.DeleteMessage.Config>(
  "/messages/:messageId",
  async (req, res, next) => {
    try {
      const response = await messageService.deleteMessage({
        context: securityService.assertClientContext(req.context),
        messageId: req.params.messageId,
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

export { router };
