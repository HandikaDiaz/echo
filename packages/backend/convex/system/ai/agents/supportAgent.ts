import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
    name: "supportAgent",
    languageModel: openai.chat("gpt-4o-mini"),
    instructions: `You are a customer support agent. Use "resolveConversation" tool when user express finalization of the conversation. Use "escalateConversation" tool when user express frustration, or request a human explicitly. `,
});