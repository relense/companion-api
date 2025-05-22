import { OpenAI } from "openai";
import { SecurityContext } from "./security.service.js";
import { ChatCompletionMessageParam } from "openai/resources.mjs";

import prompts from "../prompts/outreacthCompanion.js";
import promptUtil from "../prompts/outreacthCompanion.js";
import { messageService } from "./message.service.js";
import { companionService } from "./companion.service.js";
import { profilerService } from "./profilerService.js";
import { emailCampaignService } from "./emailCampaign.service.js";
import { json } from "stream/consumers";
import { Profiler } from "../models/Profiler.js";
import { emailService } from "./email.service.js";

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

async function sendMessageProfiler(params: {
  context: SecurityContext<"CLIENT">;
  message: ClientApi.SendProfilerMessage.RequestBody["message"];
  profilerId: string;
}): Promise<{
  message: { role: string; content: string };
  profiler?: {
    profilerId: string;
    email: string;
    location: string;
    name: string;
    companyUrl: string;
    socialMediaUrl: string;
    otherSourcesUrl: string;
    createdAt: string;
    updatedAt: string;
    companionId: string;
    emailCampaignId: string;
  };
}> {
  const profiler = await profilerService.getProfiler({
    context: params.context,
    profilerId: params.profilerId,
  });

  const profilerMessages = await messageService.getAllMessagesByProfiler({
    context: params.context,
    profilerId: params.profilerId,
    pagination: { page: 1, size: 25 },
  });

  if (params.message?.role === "user") {
    const savedMessage = await messageService.createProfilerMessage({
      context: params.context,
      content: params.message.content,
      role: params.message.role,
      profilerId: params.profilerId,
    });

    profilerMessages.items.push(savedMessage);
  }

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: promptUtil.generateProfilerPrompt(),
    },
    ...profilerMessages.items,
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  const assistantMessage = response?.choices?.[0]?.message?.content ?? "";

  const emailCampaign = await emailCampaignService.getEmailCampaignByProfileId({
    context: params.context,
    profilerId: params.profilerId,
  });

  const isComplete =
    assistantMessage.includes("<PROFILER_COMPLETE>") && !profiler.hasOnBoarding;

  if (isComplete) {
    let parsedData: any = null;

    const jsonMatch = assistantMessage.match(
      /<PROFILER_JSON_START>([\s\S]*?)<PROFILER_JSON_END>/
    );

    if (jsonMatch?.[1]) {
      try {
        parsedData = JSON.parse(jsonMatch[1].trim());

        await profilerService.updateProfiler({
          context: params.context,
          profilerId: params.profilerId,
          name: parsedData.name,
          email: parsedData.email,
          location: parsedData.location,
          companyUrl: parsedData.companyUrl,
          socialMediaUrl: parsedData.socialMediaUrl,
          otherSourcesUrl: parsedData.otherSourcesUrl,
          companionId: emailCampaign.companionId,
          emailCampaignId: emailCampaign.emailCampaignId,
          updatedAt: new Date().toISOString(),
          hasOnBoarding: true,
        });

        const updatedProfiler = await profilerService.getProfiler({
          context: params.context,
          profilerId: params.profilerId,
        });

        await emailService.createEmailPersonalized({
          context: params.context,
          emailCampaignId: profiler.emailCampaignId,
        });

        return {
          message: {
            role: "assistant",
            content:
              "We have all that we need to get started. Thanks for sharing.",
          },
          profiler: Profiler.fromRow(updatedProfiler).toResource(),
        };
      } catch (err) {
        console.error("❌ Failed to parse <PROFILER_JSON_START> block", err);
      }
    }
  }

  // Save assistant message normally if not complete
  if (assistantMessage) {
    await messageService.createProfilerMessage({
      context: params.context,
      content: assistantMessage,
      role: "assistant",
      profilerId: params.profilerId,
    });
  }

  return {
    message: {
      role: "assistant",
      content: assistantMessage,
    },
  };
}

const openaiServices = {
  getInitialMessage,
  sendOpenaiMessages,
  sendOpenaiMessagesAndSave,
  sendMoreHistory,
  sendMessageProfiler,
};

export { openaiServices };
