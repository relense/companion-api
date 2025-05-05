import { supabase } from "../lib/supabaseClient.js";
import { EmailCampaign } from "../models/EmailCampaign.js";
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

const emailCampaignService = {
  createEmailCampaign,
};

export { emailCampaignService };
