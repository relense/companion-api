import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources.mjs";

import { SecurityContext } from "./security.service.js";
import promptUtil from "../prompts/outreacthCompanion.js";
import { emailCampaignService } from "./emailCampaign.service.js";
import { messageService } from "./message.service.js";
import { supabase } from "../lib/supabaseClient.js";
import { Errors } from "../utils/errors.js";

const openai = new OpenAI({
  apiKey: process.env.OOPEN_API_TEST_KEY,
});

async function createEmail(params: {
  context: SecurityContext<"CLIENT">;
  emailCampaignId: ClientApi.CreateEmail.PathParameters["emailCampaignId"];
}) {
  const emailCampaign = await emailCampaignService.getEmailCampaign({
    context: params.context,
    emailCampaignId: params.emailCampaignId,
  });

  const userConversation = await messageService.getAllMessagesByCompanion({
    context: params.context,
    companionId: emailCampaign.companionId,
    pagination: { size: 25, page: 1 },
  });

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: promptUtil.generateEmailPrompt(
        userConversation.items,
        emailCampaign.isIndividual
      ),
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  // if (emailCampaign.isIndividual) {
  //   const { data, error } = await supabase
  //     .from("Profiler")
  //     .insert({})
  //     .select()
  //     .single();
  // }

  const { data, error } = await supabase
    .from("Email")
    .insert({
      emailCampaignId: params.emailCampaignId,
      content: response.choices[0].message.content,
    })
    .select()
    .single();

  if (!data || error) {
    throw Errors.emailNotCreated();
  }

  return {
    companionId: emailCampaign.companionId,
    content: data.content,
    emailId: data.emailId,
    like: data.like,
    dislike: data.dislike,
    followup: data.followup,
    wasRefreshed: data.wasRefreshed,
    wasCopied: data.wasCopied,
    wasSent: data.wasSent,
    wasReplied: data.wasReplied,
    numberOfReplies: data.numberOfReplies,
    sentiment: data.sentiment,
    firstReply: data.firstReply,
    lastReply: data.lastReply,
    callScheduled: data.callScheduled,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    emailCampaignId: data.emailCampaignId,
    profilerId: data.profilerId ?? null,
  };
}

async function createEmailPersonalized(params: {
  context: SecurityContext<"CLIENT">;
  emailCampaignId: ClientApi.CreateEmail.PathParameters["emailCampaignId"];
}) {
  const emailCampaign = await emailCampaignService.getEmailCampaign({
    context: params.context,
    emailCampaignId: params.emailCampaignId,
  });

  const userConversation = await messageService.getAllMessagesByCompanion({
    context: params.context,
    companionId: emailCampaign.companionId,
    pagination: { size: 25, page: 1 },
  });

  const emailOnboarding = await messageService.getAllMessagesByProfiler({
    context: params.context,
    profilerId: emailCampaign.profilerId,
    pagination: { size: 25, page: 1 },
  });

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: promptUtil.generateEmailPrompt(
        userConversation.items,
        emailCampaign.isIndividual
      ),
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  const { data, error } = await supabase
    .from("Email")
    .insert({
      emailCampaignId: params.emailCampaignId,
      content: response.choices[0].message.content,
    })
    .select()
    .single();

  if (!data || error) {
    throw Errors.emailNotCreated();
  }

  return {
    companionId: emailCampaign.companionId,
    content: data.content,
    emailId: data.emailId,
    like: data.like,
    dislike: data.dislike,
    followup: data.followup,
    wasRefreshed: data.wasRefreshed,
    wasCopied: data.wasCopied,
    wasSent: data.wasSent,
    wasReplied: data.wasReplied,
    numberOfReplies: data.numberOfReplies,
    sentiment: data.sentiment,
    firstReply: data.firstReply,
    lastReply: data.lastReply,
    callScheduled: data.callScheduled,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    emailCampaignId: data.emailCampaignId,
    profilerId: data.profilerId ?? null,
  };
}

async function countAllEmailsByCampaignId(params: {
  context: SecurityContext<"CLIENT">;
  emailCampaignId: ClientApi.CreateEmail.PathParameters["emailCampaignId"];
}) {
  const { count, error } = await supabase
    .from("Emails")
    .select("*", { count: "exact", head: true })
    .eq("emailCampaignId", params.emailCampaignId);

  if (error) {
    throw Errors.companionsNotFound;
  }

  return count;
}

const emailService = {
  createEmail,
  countAllEmailsByCampaignId,
  createEmailPersonalized,
};

export { emailService };
