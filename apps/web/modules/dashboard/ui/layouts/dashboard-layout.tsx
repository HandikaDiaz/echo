import AuthGuard from '@/modules/auth/ui/components/auth-guard';
import OrganizantionGuard from '@/modules/auth/ui/components/organization-guatd';
import DashboardSidebar from '@/modules/dashboard/ui/components/dashboard-sidebar';
import { SidebarProvider } from '@workspace/ui/components/sidebar';
import { cookies } from 'next/headers';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <AuthGuard>
            <OrganizantionGuard>
                <SidebarProvider defaultOpen={defaultOpen}>
                    <DashboardSidebar />
                    <main className="flex flex-1 flex-col">
                        {children}
                    </main>
                </SidebarProvider>
            </OrganizantionGuard>
        </AuthGuard>
    );
};