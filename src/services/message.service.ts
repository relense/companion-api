import { supabase } from "../lib/supabaseClient.js";
import { Message } from "../models/Message.js";
import { Errors } from "../utils/errors.js";
import { Pagination } from "../utils/paginationUtils.js";
import { companionService } from "./companion.service.js";
import { openaiServices } from "./openai.service.js";
import { SecurityContext } from "./security.service.js";

async function insertBulkMessages(params: {
  context: SecurityContext<"CLIENT">;
  messages: {
    role: string;
    content: string;
  }[];
  companionId: string;
}) {
  const messageData = params.messages.map((item) => {
    return {
      role: item.role,
      content: item.content,
      companionId: params.companionId,
    };
  });

  const insertedMessages = [];

  for (const message of messageData) {
    const { data, error } = await supabase
      .from("Message")
      .insert(message)
      .select()
      .single();

    if (!data || error) {
      throw Errors.messageNotCreated(JSON.stringify(error));
    }

    insertedMessages.push(data);
  }

  return {
    items: insertedMessages,
    itemCount: insertedMessages.length,
  };
}

async function createMessage(params: {
  context: SecurityContext<"CLIENT">;
  content: string;
  role: string;
  companionId: string;
}) {
  let { data, error } = await supabase
    .from("Message")
    .insert([
      {
        role: params.role,
        content: params.content,
        companionId: params.companionId,
      },
    ])
    .select()
    .single();

  if (!data || error) throw Errors.messageNotCreated(params.content);

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
  context: SecurityContext<"ADMIN">;
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
  content: string;
}) {
  let { data, error } = await supabase
    .from("Message")
    .update({ content: params.content })
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
  const companion = await companionService.getCompanion({
    context: params.context,
    companionId: params.companionId,
  });

  const from = (params.pagination.page - 1) * params.pagination.size;
  const to = from + params.pagination.size - 1;

  let { data, error } = await supabase
    .from("Message")
    .select("*")
    .eq("companionId", companion.companionId)
    .range(from, to);

  if (!data || error) throw new Error("Fetch failed");

  let newItems: {
    messageId: string;
    role: "assistant" | "user";
    content: string;
    createdAt: string;
    updatedAt: string;
    companionId: string;
  }[] = [];

  if (data.length > 0) {
    const response = await openaiServices.sendOpenaiMessages({
      context: params.context,
      messages: data,
    });

    if (data[data.length - 1].role === "user") {
      const newMessage = await createMessage({
        context: params.context,
        companionId: params.companionId,
        content: response.choices[0].message.content || "...",
        role: "assistant",
      });

      if (response) {
        data.push(newMessage);
      }
    }

    newItems = data.map(Message.fromRow).map((msg) => msg.toResource());
  }

  return {
    items: data,
    itemCount: newItems.length,
    pagination: params.pagination,
  };
}

const messageService = {
  insertBulkMessages,
  createMessage,
  getMessage,
  getAllMessages,
  updateMessage,
  deleteMessage,
  getAllMessagesByCompanion,
};

export { messageService };
