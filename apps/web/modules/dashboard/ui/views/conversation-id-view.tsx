"use client";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import { z } from "zod";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AIConversation, AIConversationContent, AIConversationScrollButton } from "@workspace/ui/components/ai/conversation";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { AIInput, AIInputSubmit, AIInputTextarea, AIInputButton, AIInputToolbar, AIInputTools } from "@workspace/ui/components/ai/input";
import { AIMessage, AIMessageContent } from "@workspace/ui/components/ai/message";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";
import { FormField } from "@workspace/ui/components/form";

const formSchema = z.object({
    message: z.string().min(1, "Message is required")
});

export default function ConversationIdView({
    conversationId
}: {
    conversationId: Id<"conversations">
}) {
    const conversation = useQuery(api.private.conversations.getOne, {
        conversationId
    });

    const messages = useThreadMessages(
        api.private.messages.getMany,
        conversation?.threadId ? { threadId: conversation.threadId } : "skip",
        { initialNumItems: 10, }
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });

    const createMessage = useMutation(api.private.messages.create);

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        try {
            await createMessage({
                conversationId,
                prompt: value.message
            });

            form.reset();
        } catch (error) {
            console.log(error);

        }
    };

    return (
        <div className="flex h-full flex-col bg-muted">
            <header className="flex items-center justify-between border-b bg-background p-2.5">
                <Button
                    size="sm"
                    variant="ghost">
                    <MoreHorizontalIcon />
                </Button>
            </header>
            <AIConversation className="max-h-[calc(100vh-180px)]">
                <AIConversationContent>
                    {toUIMessages(messages.results ?? [])?.map((message) => (
                        <AIMessage
                            key={message.id}
                            from={message.role === "user" ? "assistant" : "user"}>
                            <AIMessageContent>
                                <AIResponse>
                                    {message.text}
                                </AIResponse>
                            </AIMessageContent>
                            {message.role === "user" && (
                                <DicebearAvatar
                                    seed={conversation?.contactSessionId ?? "user"}
                                    size={32} />
                            )}
                        </AIMessage>
                    ))}
                </AIConversationContent>
                <AIConversationScrollButton />
            </AIConversation>

            <div className="p-2">
                <Form  {...form}>
                    <AIInput onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            disabled={conversation?.status === "resolved"}
                            name="message"
                            render={({ field }) => (
                                <AIInputTextarea
                                    disabled={
                                        conversation?.status === "resolved" || form.formState.isSubmitting
                                    }
                                    onChange={field.onChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            form.handleSubmit(onSubmit)();
                                        }
                                    }}
                                    placeholder={
                                        conversation?.status === "resolved"
                                            ? "This conversation has been resolved"
                                            : "Type your response as an operator..."
                                    }
                                    value={field.value}
                                />
                            )}
                        />
                        <AIInputToolbar>
                            <AIInputTools>
                                <AIInputButton>
                                    <Wand2Icon />
                                    Enchance
                                </AIInputButton>
                            </AIInputTools>
                            <AIInputSubmit
                                disabled={
                                    conversation?.status === "resolved" ||
                                    !form.formState.isValid ||
                                    form.formState.isSubmitting
                                }
                                status="ready"
                                type="submit"
                            />
                        </AIInputToolbar>
                    </AIInput>
                </Form>
            </div>
        </div>
    )
}