import { OpenAI } from "openai";
import { SecurityContext } from "./security.service.js";
import { ChatCompletionMessageParam } from "openai/resources.mjs";

import prompts from "../prompts/outreacthCompanion.js";
import promptUtil from "../prompts/outreacthCompanion.js";
import { messageService } from "./message.service.js";

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
  context: SecurityContext<"PUBLIC">;
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
  message: ClientApi.SendOpenaiMessages.RequestBody["message"];
  companionId: string;
}) {
  await messageService.createMessage({
    context: params.context,
    content: params.message.content,
    role: params.message.role,
    companionId: params.companionId,
  });

  const companionMessages = await messageService.getAllMessagesByCompanion({
    context: params.context,
    companionId: params.companionId,
    pagination: { page: 1, size: 25 },
  });

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
}) {
  const messages = [
    {
      role: "system",
      content: promptUtil.generateMoreHistoryPrompt(params.messages),
    },
    ...params.messages,
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
