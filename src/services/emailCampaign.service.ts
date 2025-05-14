import { supabase } from "../lib/supabaseClient.js";
import { EmailCampaign } from "../models/EmailCampaign.js";
import { Errors } from "../utils/errors.js";
import { companionService } from "./companion.service.js";
import { emailService } from "./email.service.js";
import { SecurityContext } from "./security.service.js";

async function createEmailCampaign(params: {
  context: SecurityContext<"CLIENT">;
  companionId: string;
}) {
  const companion = await companionService.getCompanion({
    context: params.context,
    companionId: params.companionId,
  });

  const companions = await companionService.countCompanions({
    context: params.context,
  });

  if (companion) {
    const { data, error } = await supabase
      .from("EmailCampaign")
      .insert({
        name: `Campaign ${companions ? companions + 1 : "1"}`,
        companionId: params.companionId,
      })
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
  const { data, error } = await supabase
    .from("EmailCampaign")
    .select("*")
    .eq("emailCampaignId", params.emailCampaignId)
    .single();

  if (!data || error) {
    throw Errors.emailCampaignNotFound(params.emailCampaignId);
  }

  const { data: emails, error: emailError } = await supabase
    .from("Email")
    .select("*")
    .eq("emailCampaignId", params.emailCampaignId);

  if (!emails || emailError) {
    throw Errors.emailCampaignNotFound(params.emailCampaignId);
  }

  return {
    emailCampaignId: data.emailCampaignId,
    companionId: data.companionId,
    isIndividual: data.isIndividual ?? null,
    name: data.name ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    emails: emails.map((e) => ({
      emailId: e.emailId,
      content: e.content,
      like: e.like,
      dislike: e.dislike,
      followup: e.followup,
      wasRefreshed: e.wasRefreshed,
      wasCopied: e.wasCopied,
      numberOfReplies: e.numberOfReplies,
      sentiment: e.sentiment,
      firstReply: e.firstReply,
      lastReply: e.lastReply,
      notes: e.notes,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      emailCampaignId: e.emailCampaignId,
    })),
  };
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

async function updateEmailCampaign(params: {
  context: SecurityContext<"CLIENT">;
  name?: string;
  isIndividual?: boolean;
  emailCampaignId: string;
}) {
  const updates: any = {};

  if (params.name !== undefined && params.name !== null)
    updates.name = params.name;
  if (params.isIndividual !== undefined && params.isIndividual !== null)
    updates.isIndividual = params.isIndividual;

  let { data, error } = await supabase
    .from("EmailCampaign")
    .update(updates)
    .eq("emailCampaignId", params.emailCampaignId)
    .select()
    .single();

  if (!data || error) {
    throw Errors.emailCampaignNotFound(params.emailCampaignId);
  }

  const emailCount = await emailService.countAllEmailsByCampaignId({
    context: params.context,
    emailCampaignId: params.emailCampaignId,
  });

  if (emailCount === null) {
    emailService.createEmail({
      context: params.context,
      emailCampaignId: params.emailCampaignId,
    });
  }

  return EmailCampaign.fromRow(data).toResource();
}

const emailCampaignService = {
  createEmailCampaign,
  getEmailCampaign,
  getAllEmailCampaign,
  updateEmailCampaign,
};

export { emailCampaignService };
