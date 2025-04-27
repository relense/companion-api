import { OpenAI } from "openai";
import { SecurityContext } from "./security.service.js";
import { ChatCompletionMessageParam } from "openai/resources.mjs";

import prompts from "../prompts/outreacthCompanion.js";
import promptUtil from "../prompts/outreacthCompanion.js";
import { messageService } from "./message.service.js";
import { companionService } from "./companion.service.js";

const openai = new OpenAI({
  apiKey: process.env.OOPEN_API_TEST_KEY,
});

async function getInitialMessage(params: {
  context: SecurityContext<"PUBLIC">;
}) {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: prompts.generateOnBoardingPrompt() },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return response;
}
async function sendOpenaiMessages(params: {
  context: SecurityContext<"PUBLIC"> | SecurityContext<"CLIENT">;
  messages: OpenaiApi.SendOpenaiMessages.RequestBody["messages"];
}) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: promptUtil.generateOnBoardingPrompt(),
    },
    ...(params.messages as ChatCompletionMessageParam[]),
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return response;
}

async function sendOpenaiMessagesAndSave(params: {
  context: SecurityContext<"CLIENT">;
  messages: ClientApi.SendMessagesAndSave.RequestBody["messages"];
  companionId: string;
}) {
  const companionMessages = await messageService.getAllMessagesByCompanion({
    context: params.context,
    companionId: params.companionId,
    pagination: { page: 1, size: 25 },
  });

  if (
    companionMessages.items.length > 0 &&
    companionMessages.items[companionMessages.items.length - 1].role ===
      "assistant"
  ) {
    const message = await messageService.createMessage({
      context: params.context,
      content: params.messages[params.messages.length - 1].content,
      role: params.messages[params.messages.length - 1].role,
      companionId: params.companionId,
    });

    companionMessages.items.push(message);
  } else {
    for (const message of params.messages) {
      const savedMessage = await messageService.createMessage({
        context: params.context,
        content: message.content,
        role: message.role,
        companionId: params.companionId,
      });

      companionMessages.items.push(savedMessage);
    }
  }

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: promptUtil.generateOnBoardingPrompt(),
    },
    ...companionMessages.items,
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  if (
    response?.choices?.[0]?.message?.content?.includes("<ONBOARDING_COMPLETE>")
  ) {
    await companionService.updateCompanion({
      context: params.context,
      companionId: params.companionId,
      name: "",
      hasOnBoarding: true,
    });
  }

  return response;
}

async function generateEmail(params: {
  context: SecurityContext<"CLIENT">;
  messages: ClientApi.CreateEmail.RequestBody["messages"];
}) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: promptUtil.generateEmailPrompt(params.messages),
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return response;
}

async function sendMoreHistory(params: {
  context: SecurityContext<"CLIENT">;
  messages: ClientApi.CreateMoreHistory.RequestBody["messages"];
  companionId: string;
}) {
  const companionMessages = await messageService.getAllMessagesByCompanion({
    context: params.context,
    companionId: params.companionId,
    pagination: { page: 1, size: 25 },
  });

  if (
    companionMessages.items.length > 0 &&
    companionMessages.items[companionMessages.items.length - 1].role ===
      "assistant"
  ) {
    const message = await messageService.createMessage({
      context: params.context,
      content: params.messages[params.messages.length - 1].content,
      role: params.messages[params.messages.length - 1].role,
      companionId: params.companionId,
    });

    companionMessages.items.push(message);
  } else {
    for (const message of params.messages) {
      const savedMessage = await messageService.createMessage({
        context: params.context,
        content: message.content,
        role: message.role,
        companionId: params.companionId,
      });

      companionMessages.items.push(savedMessage);
    }
  }

  const messages = [
    {
      role: "system",
      content: promptUtil.generateMoreHistoryPrompt(params.messages),
    },
    ...companionMessages.items,
  ] as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return response;
}

const openaiServices = {
  getInitialMessage,
  sendOpenaiMessages,
  sendOpenaiMessagesAndSave,
  generateEmail,
  sendMoreHistory,
};

export { openaiServices };
