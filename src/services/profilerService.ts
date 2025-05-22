import { supabase } from "../lib/supabaseClient.js";
import { Profiler } from "../models/Profiler.js";
import { Errors } from "../utils/errors.js";
import { SecurityContext } from "./security.service.js";

async function createProfiler(params: {
  context: SecurityContext<"CLIENT">;
  companionId: string;
  emailCampaignId: string;
}) {
  let { data, error } = await supabase
    .from("Profiler")
    .insert([
      {
        companionId: params.companionId,
        emailCampaignId: params.emailCampaignId,
      },
    ])
    .select()
    .single();

  if (!data || error) throw Errors.profilerNotCreated();

  const final = Profiler.fromRow(data);

  return final;
}

async function getProfiler(params: {
  context: SecurityContext<"CLIENT">;
  profilerId: string;
}) {
  let { data, error } = await supabase
    .from("Profiler")
    .select("*")
    .eq("profilerId", params.profilerId)
    .single();

  if (!data || error) throw Errors.profilerNotfound(params.profilerId);

  return Profiler.fromRow(data);
}

async function getProfilerByEmailCampaignId(params: {
  context: SecurityContext<"CLIENT">;
  emailCampaignId: string;
}) {
  let { data, error } = await supabase
    .from("Profiler")
    .select("*")
    .eq("emailCampaignId", params.emailCampaignId)
    .single();

  if (!data || error) {
    throw Errors.profilerNotfound(params.emailCampaignId);
  }

  return Profiler.fromRow(data).toResource();
}

async function updateProfiler(params: {
  context: SecurityContext<"CLIENT">;
  profilerId: string;
  name?: string;
  email?: string;
  location?: string;
  companyUrl?: string;
  socialMediaUrl?: string;
  otherSourcesUrl?: string;
  companionId?: string | null;
  emailCampaignId?: string | null;
  updatedAt?: string;
  hasOnBoarding?: boolean;
}) {
  const { profilerId, context, ...fieldsToUpdate } = params;

  const { data, error } = await supabase
    .from("Profiler")
    .update(fieldsToUpdate)
    .eq("profilerId", profilerId)
    .select()
    .single();

  if (!data || error) {
    throw Errors.profilerUpdateFailed(profilerId);
  }

  return Profiler.fromRow(data);
}

const profilerService = {
  createProfiler,
  getProfiler,
  getProfilerByEmailCampaignId,
  updateProfiler,
};

export { profilerService };
