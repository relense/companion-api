import { SecurityContext } from "./security.service.js";

async function createMessage(params: {
  context: SecurityContext<"CLIENT">;
  message: string;
}) {}

async function getMessage(params: {
  context: SecurityContext<"CLIENT">;
  bookingId: string;
}) {}

async function getAllMessages(params: { context: SecurityContext<"CLIENT"> }) {}

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
