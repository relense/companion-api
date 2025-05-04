import { supabase } from "../lib/supabaseClient.js";
import { Errors } from "../utils/errors.js";
import { companionService } from "./companion.service.js";
import { messageService } from "./message.service.js";
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

  const messages = await messageService.getAllMessagesByCompanion({
    context: params.context,
    companionId: companions.items[0].companionId,
    pagination: { page: 1, size: 1 },
  });

  if (messages.items.length === 0) {
    const createMessages = await messageService.insertBulkMessages({
      context: params.context,
      companionId: companions.items[0].companionId,
      messages: params.messages,
    });

    if (!createMessages) {
      throw Errors.messageNotCreated(JSON.stringify("Error"));
    }
  }

  return companions;
}

const userService = {
  validateUser,
  completeUserAuth,
};

export { userService };
