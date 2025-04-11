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
    .insert([{ description: params.message, userId: params.context.userId }])
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

async function getAllMessagesByUser(params: {
  context: SecurityContext<"CLIENT">;
  pagination: Pagination;
}) {
  const from = (params.pagination.page - 1) * params.pagination.size;
  const to = from + params.pagination.size - 1;

  let { data, error } = await supabase
    .from("Message")
    .select("*")
    .eq("userId", params.context.userId)
    .range(from, to);

  if (!data) throw new Error("Fetch failed");

  return {
    items: data.map(Message.fromRow).map((msg) => msg.toResource()),
    itemCount: data.length,
    pagination: params.pagination,
  };
}

async function getAllMessages(params: {
  context: SecurityContext<"CLIENT">;
  pagination: Pagination;
}) {
  const from = (params.pagination.page - 1) * params.pagination.size;
  const to = from + params.pagination.size - 1;

  let { data, error } = await supabase
    .from("Message")
    .select("*")
    .range(from, to);

  if (!data) throw new Error("Fetch failed");

  return {
    items: data.map(Message.fromRow).map((msg) => msg.toResource()),
    itemCount: data.length,
    pagination: params.pagination,
  };
}

async function updateMessage(params: {
  context: SecurityContext<"CLIENT">;
  messageId: string;
  message: string;
}) {
  let { data, error } = await supabase
    .from("Message")
    .update({ description: params.message })
    .eq("messageId", params.messageId)
    .select();

  if (error || !data || data.length === 0) {
    throw new Error("Failed to update message");
  }

  return Message.fromRow(data[0]);
}

async function deleteMessage(params: {
  context: SecurityContext<"CLIENT">;
  messageId: string;
}) {
  const { data, error } = await supabase
    .from("Message")
    .delete()
    .eq("messageId", params.messageId)
    .select();

  if (error || !data || data.length === 0) {
    throw new Error(`Failed to update message: ${error}`);
  }

  return Message.fromRow(data[0]);
}

const messageService = {
  createMessage,
  getMessage,
  getAllMessagesByUser,
  getAllMessages,
  updateMessage,
  deleteMessage,
};

export { messageService };
