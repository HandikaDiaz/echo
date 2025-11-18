import { groq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
    name: "groq",
    languageModel: groq("gemma2-9b-it"),
    instructions: `You are a customer support agent. Use "resolveConversation" tool when user express finalization of the conversation. Use "escalateConversation" tool when user express frustration, or request a human explicitly. `,
});