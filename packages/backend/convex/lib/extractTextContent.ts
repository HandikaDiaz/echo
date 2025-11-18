import { groq } from "@ai-sdk/groq";
import { assert } from "convex-helpers";
import { StorageActionWriter } from "convex/server";
import { Id } from "../_generated/dataModel";
import { FilePart, generateText } from "ai";

const AI_MODELS = {
    image: groq("gemma2-9b-it"),
    pdf: groq("llama-3.3-70b-versatile"),
    html: groq("llama-3.1-8b-instant"),
} as const;

const SUPPORTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];

const SYSTEM_PROMPTS = {
    image: "You turn image into text. If it is a photo of a document, transcribe it. If it is not a document, describe it.",
    pdf: "You transform PDF files into text.",
    html: "You transform content into markdown."
};

export type ExtractTextContentArgs = {
    storageId: Id<"_storage">;
    filename: string;
    bytes?: ArrayBuffer;
    mimeType: string;
};

export async function extractTextContent(
    ctx: { storage: StorageActionWriter },
    args: ExtractTextContentArgs
): Promise<string> {
    const { storageId, filename, bytes, mimeType } = args;

    const url = await ctx.storage.getUrl(storageId);
    assert(url, "Failed to get storage URL");

    if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
        return extractImageText(url);
    }

    if (mimeType.toLowerCase().includes("pdf")) {
        return extractPdfText(url, mimeType, filename);
    }

    if (mimeType.toLowerCase().includes("text")) {
        return extractTextFileContent(ctx, storageId, bytes, mimeType);
    }

    throw new Error(`Unsupported MIME type: ${mimeType}`);
};

async function extractTextFileContent(
    ctx: { storage: StorageActionWriter },
    storageId: Id<"_storage">,
    bytes: ArrayBuffer | undefined,
    mimeType: string,
): Promise<string> {
    const arrayBuffer = bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer())

    if (!arrayBuffer) {
        throw new Error("Failed to get file content");
    }

    const text = new TextDecoder().decode(arrayBuffer);

    if (mimeType.toLowerCase() !== "text/plain") {
        const result = await generateText({
            model: AI_MODELS.html,
            system: SYSTEM_PROMPTS.html,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text },
                        {
                            type: "text",
                            text: "Extract the text and print it in a markdown without explaining that you'll do so."
                        }
                    ]
                }
            ]
        });

        return result.text;
    }

    return text;
};


async function extractImageText(url: string): Promise<string> {
    try {
        const result = await generateText({
            model: AI_MODELS.image,
            system: SYSTEM_PROMPTS.image,
            messages: [
                {
                    role: "user",
                    content: [{ type: "image", image: new URL(url) }]
                },
            ],
        });
        return result.text;
    } catch (error) {
        console.error("Groq image processing failed:", error);
        return "The image could not be processed.";
    }
};

type MyFilePart = FilePart & { mimeType: string };

async function extractPdfText(url: string, mimeType: string, filename: string): Promise<string> {
    const result = await generateText({
        model: AI_MODELS.pdf,
        system: SYSTEM_PROMPTS.pdf,
        messages: [
            {
                role: "user",
                content: [
                    { type: "file", data: new URL(url), mimeType, filename } as MyFilePart,
                    {
                        type: "text",
                        text: "Extract the text from the PDF and print it without explaining you'll do so."
                    }
                ]
            }
        ]
    });

    return result.text;
};