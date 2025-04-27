import { supabase } from "../lib/supabaseClient.js";
import { Companion } from "../models/Companion.js";
import { Message } from "../models/Message.js";
import { Errors } from "../utils/errors.js";
import { Pagination } from "../utils/paginationUtils.js";
import { SecurityContext } from "./security.service.js";

async function createCompanion(params: {
  context: SecurityContext<"CLIENT">;
  name: string | undefined;
  hasOnBoarding: boolean;
}) {
  let { data, error } = await supabase
    .from("Companion")
    .insert([
      {
        name: params.name ? params.name : "Companion",
        hasOnBoarding: params.hasOnBoarding,
        userId: params.context.userId,
      },
    ])
    .select()
    .single();

  if (!data || error)
    throw Errors.companionNotCreated(error ? error.message : params.name || "");

  const final = Companion.fromRow(data);

  return final;
}

async function getCompanion(params: {
  context: SecurityContext<"CLIENT">;
  companionId: string;
}) {
  let { data, error } = await supabase
    .from("Companion")
    .select("*")
    .eq("companionId", params.companionId)
    .single();

  if (!data || error) throw Errors.companionNotFound(params.companionId);

  return Companion.fromRow(data);
}

async function getAllCompanions(params: {
  context: SecurityContext<"CLIENT">;
  pagination: Pagination;
}) {
  const from = (params.pagination.page - 1) * params.pagination.size;
  const to = from + params.pagination.size - 1;

  let { data, error } = await supabase
    .from("Companion")
    .select("*")
    .range(from, to);

  if (!data) throw Errors.companionsNotFound();

  return {
    items: data
      .map(Companion.fromRow)
      .map((companion) => companion.toResource()),
    itemCount: data.length,
    pagination: params.pagination,
  };
}

async function updateCompanion(params: {
  context: SecurityContext<"CLIENT">;
  companionId: string;
  name: string;
  hasOnBoarding: boolean;
}) {
  let { data, error } = await supabase
    .from("Companion")
    .update({ name: params.name, hasOnBoarding: params.hasOnBoarding })
    .eq("companionId", params.companionId)
    .select();

  if (error || !data || data.length === 0) {
    throw new Error("Failed to update message");
  }

  return Message.fromRow(data[0]);
}

async function deleteCompanion(params: {
  context: SecurityContext<"CLIENT">;
  companionId: string;
}) {
  const { data, error } = await supabase
    .from("Companion")
    .delete()
    .eq("companionId", params.companionId)
    .select();

  if (error || !data || data.length === 0) {
    throw new Error(`Failed to update companion: ${error}`);
  }

  return Message.fromRow(data[0]);
}

const companionService = {
  createCompanion,
  getCompanion,
  getAllCompanions,
  updateCompanion,
  deleteCompanion,
};

export { companionService };
