"use client";

import { useState } from "react";
import { Container } from "@/components/site/Container";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData as any).toString(),
            });

            if (response.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <Container>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                    <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Message Received</h1>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            Thank you for reaching out. I'll get back to you as soon as possible.
                        </p>
                    </div>
                    <button
                        onClick={() => setStatus("idle")}
                        className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                    >
                        Send another message
                    </button>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
                    <p className="text-gray-500">
                        Have a question about my research? Interested in collaborating? Drop me a message below.
                    </p>
                </div>

                <form
                    name="contact"
                    method="POST"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <input type="hidden" name="form-name" value="contact" />

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                required
                                placeholder="Your name"
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="institution" className="text-sm font-medium leading-none">
                            Institution / Company (Optional)
                        </label>
                        <input
                            id="institution"
                            name="institution"
                            placeholder="University or Laboratory"
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="interest" className="text-sm font-medium leading-none">
                            Primary Interest
                        </label>
                        <select
                            id="interest"
                            name="interest"
                            required
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select an area</option>
                            <option value="geometric-dl">Geometric Deep Learning</option>
                            <option value="quantum-gravity">Quantum Gravity</option>
                            <option value="categorical-qm">Categorical QM</option>
                            <option value="collaboration">General Collaboration</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium leading-none">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            placeholder="What can I help you with?"
                            rows={5}
                            className="flex min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    {status === "error" && (
                        <p className="text-sm font-medium text-red-600">
                            Something went wrong. Please try again or email me directly.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="inline-flex items-center justify-center rounded-md bg-black px-8 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all gap-2"
                    >
                        {status === "submitting" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                Send Message <Send className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </Container>
    );
}
