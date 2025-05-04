import { supabase } from "../lib/supabaseClient.js";
import { Errors } from "../utils/errors.js";
import { companionService } from "./companion.service.js";
import { messageService } from "./message.service.js";
import { openaiServices } from "./openai.service.js";
import { SecurityContext } from "./security.service.js";

async function validateUser(params: { userToken: string }) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(params.userToken);

  if (error || !user) {
    throw Errors.userNotFound(params.userToken);
  }

  return user;
}

async function completeUserAuth(params: {
  context: SecurityContext<"CLIENT">;
  messages: {
    role: string;
    content: string;
  }[];
}) {
  const companions = await companionService.getAllCompanions({
    context: params.context,
    pagination: { page: 1, size: 3 },
  });

  //IF the user doesnt have a companion. Create one. Insert all messages
  if (companions.items.length === 0) {
    const companion = await companionService.createCompanion({
      context: params.context,
      hasOnBoarding: false,
      name: "Companion",
    });

    if (params.messages.length === 0) {
      return companions.items[0];
    }

    const createMessages = await messageService.insertBulkMessages({
      context: params.context,
      companionId: companion.companionId,
      messages: params.messages,
    });

    if (!createMessages) {
      throw Errors.messageNotCreated(JSON.stringify("Error"));
    }

    if (
      params.messages.length > 0 &&
      params.messages[params.messages.length - 1].role === "user"
    ) {
      const response = await openaiServices.sendOpenaiMessages({
        context: params.context,
        messages: params.messages as any,
      });

      messageService.createMessage({
        context: params.context,
        companionId: companion.companionId,
        content: response.choices[0].message.content || "",
        role: "assistant",
      });
    }

    return companion;
    // ELSE there is a companion. Does it have messages? If not, add all messages else do nothing.
  } else {
    const messages = await messageService.getAllMessagesByCompanion({
      context: params.context,
      companionId: companions.items[0].companionId,
      pagination: { page: 1, size: 1 },
    });

    if (messages.items.length === 0 && params.messages.length > 0) {
      const createMessages = await messageService.insertBulkMessages({
        context: params.context,
        companionId: companions.items[0].companionId,
        messages: params.messages,
      });

      if (!createMessages) {
        throw Errors.messageNotCreated(JSON.stringify("Error"));
      }
    }

    const newMessages =
      messages.items.length > 0 ? messages.items : params.messages;

    if (
      newMessages.length > 0 &&
      newMessages[newMessages.length - 1].role === "user"
    ) {
      const response = await openaiServices.sendOpenaiMessages({
        context: params.context,
        messages: newMessages,
      });

      messageService.createMessage({
        context: params.context,
        companionId: companions.items[0].companionId,
        content: response.choices[0].message.content || "",
        role: "assistant",
      });
    }
  }

  return companions.items[0];
}

const userService = {
  validateUser,
  completeUserAuth,
};

export { userService };
