import { supabase } from "../lib/supabaseClient.js";
import { Message } from "../models/Message.js";
import { Pagination } from "../utils/paginationUtils.js";
import { SecurityContext } from "./security.service.js";

async function createMessage(params: {
  context: SecurityContext<"CLIENT">;
  message: string;
}) {
  let data = await supabase
    .from("Message")
    .insert([{ description: params.message }])
    .select()
    .single();

  if (!data) throw new Error("Creation failed");

  return Message.fromRow(data.data);
}

async function getMessage(params: {
  context: SecurityContext<"CLIENT">;
  messageId: string;
}) {
  let data = await supabase
    .from("Message")
    .select("*")
    .eq("messageId", params.messageId)
    .single();

  if (!data) throw new Error("Fetch failed");

  return Message.fromRow(data.data);
}

async function getAllMessages(params: {
  pagination: Pagination;
  context: SecurityContext<"CLIENT">;
}) {
  const from = (params.pagination.page - 1) * params.pagination.size;
  const to = from + params.pagination.size - 1;

  let { data, error } = await supabase
    .from("Message")
    .select("*")
    .range(from, to);

  if (!data) throw new Error("Fetch failed");

  return {
    items: data,
    itemCount: data.length,
  };
}

async function updateMessage(params: {
  context: SecurityContext<"CLIENT">;
  messageId: string;
}) {}

async function deleteMessage(params: {
  context: SecurityContext<"CLIENT">;
  messageId: string;
}) {}

const messageService = {
  createMessage,
  getMessage,
  getAllMessages,
  updateMessage,
  deleteMessage,
};

export { messageService };
