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

  if (companions.items.length === 0) {
    const response = await companionService.createCompanion({
      context: params.context,
      name: "Companion 1",
      hasOnBoarding: true,
    });

    const createMessages = await messageService.insertBulkMessages({
      context: params.context,
      companionId: response.companionId,
      messages: params.messages,
    });

    if (!response || !createMessages) {
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
