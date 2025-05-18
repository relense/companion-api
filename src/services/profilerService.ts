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

  if (!data || error) throw Errors.profilerNotCreated();

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

  if (!data || error) throw Errors.profilerNotCreated();

  return Profiler.fromRow(data);
}

const profilerService = {
  createProfiler,
  getProfiler,
  getProfilerByEmailCampaignId,
};

export { profilerService };
