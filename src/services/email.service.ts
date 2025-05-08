import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources.mjs";

import { SecurityContext } from "./security.service.js";
import promptUtil from "../prompts/outreacthCompanion.js";
import { emailCampaignService } from "./emailCampaign.service.js";
import { messageService } from "./message.service.js";
import { supabase } from "../lib/supabaseClient.js";
import { Email } from "../models/Email.js";
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
      content: promptUtil.generateEmailPrompt(userConversation.items),
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
      companionId: emailCampaign.companionId,
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
  };
}

const emailService = {
  createEmail,
};

export { emailService };
