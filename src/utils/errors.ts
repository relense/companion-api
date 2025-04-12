import { AppError } from "../expressServer.js";

const Errors = {
  userNotFound: (token: string) =>
    new AppError(`User with token ${token} not found`, 400),
  messageNotFound: (messageId: string) =>
    new AppError(`Message with id ${messageId} not found`, 400),
  messagesNotFound: () => new AppError(`Messages not found`, 400),
  messagesForUserNotFound: (userId: string) =>
    new AppError(`Messages not found for user with id ${userId}`, 400),
  messageNotCreated: (message: string) =>
    new AppError(`Failed to create message: ${message}`, 500),
  companionNotCreated: (name: string) =>
    new AppError(`Failed to create companion: ${name}`, 500),
  companionNotFound: (companionId: string) =>
    new AppError(`Companion with id ${companionId} not found`, 400),
  companionsNotFound: () => new AppError(`Companions not found`, 400),
  unauthorized: () => new AppError("Unauthorized", 401),
  forbidden: () => new AppError("Forbidden", 403),
};

export { Errors };
