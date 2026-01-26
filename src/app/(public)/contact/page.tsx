import { Container } from "@/components/site/Container";
import { Mail, Github, Linkedin } from "lucide-react";

export default function ContactPage() {
    return (
        <Container>
            <div className="space-y-8 max-w-xl">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Contact</h1>
                    <p className="text-lg text-gray-600">
                        I'm always open to discussing new research ideas, collaborations, or just chatting about physics.
                    </p>
                </div>

                <div className="space-y-4">
                    <a
                        href="mailto:yuvan@example.com"
                        className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-medium">Email Me</p>
                            <p className="text-sm text-gray-500">yuvan@example.com</p>
                        </div>
                    </a>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        <div className="p-2 bg-gray-100 text-gray-900 rounded-full">
                            <Github className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-medium">GitHub</p>
                            <p className="text-sm text-gray-500">Check out my code</p>
                        </div>
                    </a>
                </div>
            </div>
        </Container>
    );
}
