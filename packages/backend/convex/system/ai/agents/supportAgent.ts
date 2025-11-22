import { groq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

export const supportAgent = new Agent(components.agent, {
    name: "groq",
    languageModel: groq("gemma2-9b-it"),
    instructions: SUPPORT_AGENT_PROMPT
});