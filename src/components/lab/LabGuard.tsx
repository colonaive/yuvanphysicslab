"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight, FlaskConical } from "lucide-react";

export default function LabGuard({ children }: { children: React.ReactNode }) {
    const [isAuthed, setIsAuthed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const storedAuth = localStorage.getItem("lab_authed");
        const storedTime = localStorage.getItem("lab_auth_time");

        // 7 days expiration
        const EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

        if (storedAuth === "1" && storedTime) {
            const now = Date.now();
            if (now - parseInt(storedTime) < EXPIRATION_MS) {
                setIsAuthed(true);
            } else {
                localStorage.removeItem("lab_authed");
                localStorage.removeItem("lab_auth_time");
            }
        }
        setIsLoading(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/lab/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ passcode }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem("lab_authed", "1");
                localStorage.setItem("lab_auth_time", Date.now().toString());
                setIsAuthed(true);
            } else {
                setError("Incorrect passcode");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("lab_authed");
        localStorage.removeItem("lab_auth_time");
        setIsAuthed(false);
        setPasscode("");
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
            </div>
        );
    }

    if (!isAuthed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Private Lab Access
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Restricted area for research drafts and logs.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="passcode" className="sr-only">
                                    Passcode
                                </label>
                                <input
                                    id="passcode"
                                    name="passcode"
                                    type="password"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                    placeholder="Enter passcode"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Enter Lab <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="absolute top-[-3rem] right-0 md:top-[-4rem]">
                <button
                    onClick={handleLogout}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                    Lock Lab
                </button>
            </div>
            {children}
        </div>
    );
}
