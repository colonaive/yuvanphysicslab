"use client";

import { useRouter } from "next/navigation";
import { PenTool, Notebook, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LabDashboard() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const res = await fetch("/api/lab/logout", { method: "POST" });
            if (res.ok) {
                router.refresh();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Lab Dashboard</h1>
                    <p className="text-sm text-gray-500 italic">"Nullius in verba"</p>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                    {isLoggingOut ? <Loader2 className="h-3 w-3 animate-spin" /> : "Logout"}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/lab/scratchpad" className="group block">
                    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <PenTool className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Editor</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Draft research notes with full LaTeX support and live preview.
                        </p>
                    </div>
                </Link>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed h-full flex flex-col justify-center items-center text-center">
                    <div className="p-3 bg-gray-100 text-gray-400 rounded-lg mb-4">
                        <Notebook className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-medium text-gray-500 mb-1">Project Logs</h2>
                    <p className="text-gray-400 text-xs">Jupyter integration in progress.</p>
                </div>
            </div>
        </div>
    );
}
