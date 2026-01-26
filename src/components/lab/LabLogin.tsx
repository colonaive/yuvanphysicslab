"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight } from "lucide-react";

export function LabLogin() {
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

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

            if (res.ok) {
                router.refresh(); // Refresh to trigger server-side re-check
            } else {
                setError("Incorrect passcode");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Private Lab Access</h1>
                    <p className="mt-2 text-sm text-gray-500">Secure entry for research drafts and tools.</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm transition-all"
                            placeholder="Enter lab passcode"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in zoom-in duration-200">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Enter Lab <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
