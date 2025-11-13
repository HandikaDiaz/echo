import Image from "next/image";

export default function ConversationsView() {
    return (
        <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
            <div className="flex flex-1 items-center justify-center gap-x-2">
                <Image
                    alt="Logo"
                    width={40}
                    height={40}
                    src="/logo.svg" />
                <p className="font-semibold text-lg">Echo</p>
            </div>
        </div>
    );
};