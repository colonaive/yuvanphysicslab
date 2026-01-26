"use client";

import { useState, useEffect } from "react";
import { LabNav } from "./LabNav";
import { FlaskConical, Lock } from "lucide-react";

export default function LabGuard({
    children,
    isProtected,
}: {
    children: React.ReactNode;
    isProtected: boolean;
}) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!isProtected) {
            setIsUnlocked(true);
            setLoading(false);
            return;
        }

        const stored = localStorage.getItem("lab_unlocked");
        if (stored === "true") {
            setIsUnlocked(true);
        }
        setLoading(false);
    }, [isProtected]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);

        try {
            const res = await fetch("/api/verify-lab", {
                method: "POST",
                body: JSON.stringify({ passcode }),
            });

            const data = await res.json();
            if (data.success) {
                localStorage.setItem("lab_unlocked", "true");
                setIsUnlocked(true);
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
        }
    };

    if (loading) return null;

    if (!isUnlocked) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="flex flex-col items-center mb-6">
                        <div className="p-3 bg-red-50 text-red-500 rounded-full mb-4">
                            <Lock className="h-6 w-6" />
                        </div>
                        <h1 className="text-xl font-bold">Lab Access</h1>
                        <p className="text-gray-500 text-sm">Restricted Area</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                placeholder="Enter Passcode"
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-xs mt-2">Incorrect passcode</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Unlock
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                    <FlaskConical className="h-5 w-5" />
                    <span>Lab</span>
                </div>
                <LabNav />
            </header>
            <main className="flex-1 bg-gray-50 p-4 md:p-6">
                {children}
            </main>
        </div>
    );
}
