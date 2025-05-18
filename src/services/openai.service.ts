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
  message: ClientApi.SendMessagesAndSave.RequestBody["message"];
  companionId: string;
}) {
  const companionMessages = await messageService.getAllMessagesByCompanion({
    context: params.context,
    companionId: params.companionId,
    pagination: { page: 1, size: 25 },
  });

  const savedMessage = await messageService.createMessage({
    context: params.context,
    content: params.message.content,
    role: params.message.role,
    companionId: params.companionId,
  });

  companionMessages.items.push(savedMessage);

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

    const trimData = response?.choices?.[0]?.message?.content
      .replace("<ONBOARDING_COMPLETE>", "")
      .trim();

    await messageService.createMessage({
      context: params.context,
      content: trimData,
      role: response?.choices?.[0]?.message?.role,
      companionId: params.companionId,
    });
  } else {
    if (response && response?.choices?.[0]?.message?.content) {
      await messageService.createMessage({
        context: params.context,
        content: response?.choices?.[0]?.message?.content,
        role: response?.choices?.[0]?.message?.role,
        companionId: params.companionId,
      });
    }
  }

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

  if (params.messages[0].role == "user") {
    const savedMessage = await messageService.createMessage({
      context: params.context,
      content: params.messages[0].content,
      role: params.messages[0].role,
      companionId: params.companionId,
    });

    companionMessages.items.push(savedMessage);
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

  if (response && response?.choices?.[0]?.message?.content) {
    await messageService.createMessage({
      context: params.context,
      content: response?.choices?.[0]?.message?.content,
      role: response?.choices?.[0]?.message?.role,
      companionId: params.companionId,
    });
  }

  return response;
}

async function sendMessagesProfiler(params: {
  context: SecurityContext<"CLIENT">;
  messages: ClientApi.SendProfilerMessages.RequestBody["messages"];
  profilerId: string;
}) {
  //Get all Messages related to a profiler
  const profilerMessages = await messageService.getAllMessagesByProfiler({
    context: params.context,
    profilerId: params.profilerId,
    pagination: { page: 1, size: 25 },
  });

  //If the last message in params.messages === user then we should add that message to the list of profiler messages.
  if (params.messages[params.messages.length - 1].role == "user") {
    const savedMessage = await messageService.createProfilerMessage({
      context: params.context,
      content: params.messages[params.messages.length - 1].content,
      role: params.messages[params.messages.length - 1].role,
      profilerId: params.profilerId,
    });

    profilerMessages.items.push(savedMessage);
  }

  //Create the message object to send to chatgpt. the system prompt and the messages that the user exchanged with the system.
  const messages = [
    {
      role: "system",
      content: promptUtil.generateProfilerPrompt(),
    },
    ...profilerMessages.items,
  ] as ChatCompletionMessageParam[];

  //Create the response
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  //if there is a response then add this response to the list of messages related with the profiler
  if (response && response?.choices?.[0]?.message?.content) {
    await messageService.createProfilerMessage({
      context: params.context,
      content: response?.choices?.[0]?.message?.content,
      role: response?.choices?.[0]?.message?.role,
      profilerId: params.profilerId,
    });
  }

  //return the last message that the assistant gave. The user should have all the messages in the FE.
  return {
    message: {
      role: response.choices[0].message.role ?? "assistant",
      content: response.choices[0].message.content || "",
    },
  };
}

const openaiServices = {
  getInitialMessage,
  sendOpenaiMessages,
  sendOpenaiMessagesAndSave,
  sendMoreHistory,
  sendMessagesProfiler,
};

export { openaiServices };
