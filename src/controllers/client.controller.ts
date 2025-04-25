import { middleware } from "express-openapi-validator";
import path from "path";
import { Router } from "express";
import { fileURLToPath } from "url";

import { securityService } from "../services/security.service.js";
import { typedRouter } from "../utils/expressUtils.js";
import { messageService } from "../services/message.service.js";
import { buildPaginatedResponse } from "../utils/paginationUtils.js";
import { companionService } from "../services/companion.service.js";
import { openaiServices } from "../services/openai.service.js";
import { userService } from "../services/user.service.js";

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

//MESSAGES ROUTES

//**
// Post route: Create bulk messages
//  */
router.post<ClientApi.CreateBulkMessage.Config>(
  "/messages/bulk",
  async (req, res, next) => {
    try {
      const response = await messageService.insertBulkMessages({
        context: securityService.assertClientContext(req.context),
        companionId: req.body.companionId,
        messages: req.body.messages,
      });

      res.status(200).json(
        buildPaginatedResponse({
          items: response.items,
          total: response.itemCount,
          pagination: {
            page: 1,
            size: 25,
          },
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

//**
// Post route: Create a message
//  */
router.post<ClientApi.CreateMessage.Config>(
  "/messages",
  async (req, res, next) => {
    try {
      const response = await messageService.createMessage({
        context: securityService.assertClientContext(req.context),
        role: req.body.content,
        content: req.body.content,
        companionId: req.body.companionId,
      });

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
);

//**
// Get route: Fetch one message by message id
//  */
router.get<ClientApi.GetMessage.Config>(
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

//**
// Put route: Update one message by message id
//  */
router.put<ClientApi.UpdateMessage.Config>(
  "/messages/:messageId",
  async (req, res, next) => {
    try {
      const response = await messageService.updateMessage({
        context: securityService.assertClientContext(req.context),
        messageId: req.params.messageId,
        content: req.body.content,
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

//**
// Delete route: Delete one message by message id
//  */
router.delete<ClientApi.DeleteMessage.Config>(
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

// COMPANION ROUTES

//**
// Post route: Create a message
//  */
router.post<ClientApi.CreateCompanion.Config>(
  "/companions",
  async (req, res, next) => {
    try {
      const response = await companionService.createCompanion({
        context: securityService.assertClientContext(req.context),
        name: req.body.name,
      });

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
);

router.get<ClientApi.GetCompanions.Config>(
  "/companions",
  async (req, res, next) => {
    try {
      const response = await companionService.getAllCompanions({
        context: securityService.assertClientContext(req.context),
        pagination: {
          page: req.query.page || 1,
          size: req.query.pageSize || 25,
        },
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

router.get<ClientApi.GetCompanion.Config>(
  "/companions/:companionId",
  async (req, res, next) => {
    try {
      const response = await companionService.getCompanion({
        context: securityService.assertClientContext(req.context),
        companionId: req.params.companionId,
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

//**
// Get route: Fetchs all the messages a companion has
//  */
router.get<ClientApi.GetMessagesByCompanion.Config>(
  "/companions/:companionId/messages",
  async (req, res, next) => {
    try {
      const response = await messageService.getAllMessagesByCompanion({
        pagination: {
          page: req.query.page || 1,
          size: req.query.pageSize || 25,
        },
        context: securityService.assertClientContext(req.context),
        companionId: req.params.companionId,
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

// OPEN AI CLIENT ENDPOINTS

router.post<ClientApi.CreateEmail.Config>(
  "/gpt/email",
  async (req, res, next) => {
    try {
      const response = await openaiServices.generateEmail({
        context: securityService.assertClientContext(req.context),
        messages: req.body.messages,
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

router.post<ClientApi.CreateMoreHistory.Config>(
  "/gpt/history",
  async (req, res, next) => {
    try {
      const response = await openaiServices.sendMoreHistory({
        context: securityService.assertClientContext(req.context),
        messages: req.body.messages,
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

// COMPLETE AUTHENTICATION CLIENT ENDPOINTS

//**
// Post route: Create bulk messages
//  */
router.post<ClientApi.CompleteAuthentication.Config>(
  "/auth/complete",
  async (req, res, next) => {
    try {
      const response = await userService.completeUserAuth({
        context: securityService.assertClientContext(req.context),
        messages: req.body.messages,
      });

      res.status(200).json(
        buildPaginatedResponse({
          items: response.items,
          total: response.itemCount,
          pagination: {
            page: 1,
            size: 25,
          },
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

export { router };
