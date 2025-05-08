import { supabase } from "../lib/supabaseClient.js";
import { EmailCampaign } from "../models/EmailCampaign.js";
import { Errors } from "../utils/errors.js";
import { companionService } from "./companion.service.js";
import { SecurityContext } from "./security.service.js";

async function createEmailCampaign(params: {
  context: SecurityContext<"CLIENT">;
  companionId: string;
}) {
  const companion = await companionService.getCompanion({
    context: params.context,
    companionId: params.companionId,
  });

  if (companion) {
    const { data, error } = await supabase
      .from("EmailCampaign")
      .insert({ companionId: params.companionId })
      .select()
      .single();

    if (data) {
      return EmailCampaign.fromRow(data);
    }
  }
}

async function getEmailCampaign(params: {
  context: SecurityContext<"CLIENT">;
  emailCampaignId: string;
}) {
  let { data, error } = await supabase
    .from("EmailCampaign")
    .select("*")
    .eq("emailCampaignId", params.emailCampaignId)
    .single();

  if (!data || error) {
    throw Errors.emailCampaignNotFound(params.emailCampaignId);
  }

  return EmailCampaign.fromRow(data);
}

async function getAllEmailCampaign(params: {
  context: SecurityContext<"CLIENT">;
  companionId: string;
}) {
  let { data, error } = await supabase
    .from("EmailCampaign")
    .select("*")
    .eq("companionId", params.companionId);

  if (!data || error) {
    throw Errors.emailCampaignsNotFound();
  }

  return {
    items: data
      .map(EmailCampaign.fromRow)
      .map((campaign) => campaign.toResource()),
    itemCount: data.length,
  };
}

const emailCampaignService = {
  createEmailCampaign,
  getEmailCampaign,
  getAllEmailCampaign,
};

export { emailCampaignService };
