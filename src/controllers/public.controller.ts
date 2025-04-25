import { middleware } from "express-openapi-validator";
import path from "path";
import { Router } from "express";
import { fileURLToPath } from "url";

import { typedRouter } from "../utils/expressUtils.js";
import { openaiServices } from "../services/openai.service.js";
import { securityService } from "../services/security.service.js";

const router = typedRouter(Router());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.baseRouter().use(
  middleware({
    apiSpec: path.join(__dirname, "../api/openapi-public.json"),
    validateRequests: true,
    validateResponses: true,
  })
);

// ChatGPT ROUTES
router.post<OpenaiApi.SendOpenaiMessages.Config>(
  "/gpt",
  async (req, res, next) => {
    try {
      const response = await openaiServices.sendOpenaiMessages({
        context: securityService.assertPublicContext(req.context),
        messages: req.body.messages,
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

router.get<OpenaiApi.GetInitialMessage.Config>(
  "/gpt",
  async (req, res, next) => {
    try {
      const response = await openaiServices.getInitialMessage({
        context: securityService.assertPublicContext(req.context),
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

export { router };
