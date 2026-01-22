
import { Sidebar } from '../../components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-admin-bg min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-20 p-8 md:p-12 transition-all duration-300 w-full relative">
                {/* Background Texture */}
                <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-[0.03] pointer-events-none z-0"></div>
                <div className="relative z-10 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
