import { supabase } from "../lib/supabaseClient.js";
import { Message } from "../models/Message.js";
import { Errors } from "../utils/errors.js";
import { Pagination } from "../utils/paginationUtils.js";
import { SecurityContext } from "./security.service.js";

async function createMessage(params: {
  context: SecurityContext<"CLIENT">;
  message: string;
  companionId: string;
}) {
  let { data, error } = await supabase
    .from("Message")
    .insert([
      {
        content: params.message,
        companionId: params.companionId,
      },
    ])
    .select()
    .single();

  if (!data || error) throw Errors.messageNotCreated(params.message);

  return Message.fromRow(data);
}

async function getMessage(params: {
  context: SecurityContext<"CLIENT">;
  messageId: string;
}) {
  let { data, error } = await supabase
    .from("Message")
    .select("*")
    .eq("messageId", params.messageId)
    .single();

  if (!data || error) throw Errors.messageNotFound(params.messageId);

  return Message.fromRow(data.data);
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

  if (!data || error) throw Errors.messagesNotFound();

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
    .update({ content: params.message })
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

async function getAllMessagesByCompanion(params: {
  context: SecurityContext<"CLIENT">;
  pagination: Pagination;
  companionId: string;
}) {
  const from = (params.pagination.page - 1) * params.pagination.size;
  const to = from + params.pagination.size - 1;

  let { data, error } = await supabase
    .from("Message")
    .select("*")
    .eq("companionId", params.companionId)
    .range(from, to);

  if (!data || error) throw new Error("Fetch failed");

  return {
    items: data.map(Message.fromRow).map((msg) => msg.toResource()),
    itemCount: data.length,
    pagination: params.pagination,
  };
}

const messageService = {
  createMessage,
  getMessage,
  getAllMessages,
  updateMessage,
  deleteMessage,
  getAllMessagesByCompanion,
};

export { messageService };
