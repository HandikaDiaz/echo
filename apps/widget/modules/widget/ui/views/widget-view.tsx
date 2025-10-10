"use client";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import WidgetAuthScreen from "@/modules/widget/ui/screens/widget-auth-screen";
import WidgetChatScreen from "@/modules/widget/ui/screens/widget-chat-screen";
import WidgetErrorScreen from "@/modules/widget/ui/screens/widget-error-screen";
import WidgetLoadingScreen from "@/modules/widget/ui/screens/widget-loading-screen";
import WidgetSelesctionScreen from "@/modules/widget/ui/screens/widget-selection-screen";
import { useAtomValue } from "jotai";

interface Props {
    organizationId: string;
};

export default function WidgetView({ organizationId }: Props) {
    const screen = useAtomValue(screenAtom);

    const screenComponent = {
        error: <WidgetErrorScreen />,
        loading: <WidgetLoadingScreen organizationId={organizationId} />,
        auth: <WidgetAuthScreen />,
        voice: <p>TODO: Voice</p>,
        inbox: <p>TODO: Inbox</p>,
        selection: <WidgetSelesctionScreen />,
        chat: <WidgetChatScreen />,
        contact: <p>TODO: Contact</p>,
    };

    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            {screenComponent[screen]}
        </main>
    );
};