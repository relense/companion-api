import { OpenAI } from "openai";
import { SecurityContext } from "./security.service.js";
import { ChatCompletionMessageParam } from "openai/resources.mjs";

import prompts from "../prompts/outreacthCompanion.js";

const openai = new OpenAI({
  apiKey: process.env.OOPEN_API_TEST_KEY,
});

async function sendOpenaiMessages(params: {
  context: SecurityContext<"PUBLIC">;
}) {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: prompts.outreachCompanionBasePrompt },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  return response;
}

const openaiServices = {
  sendOpenaiMessages,
};

export { openaiServices };
