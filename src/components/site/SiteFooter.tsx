import { Container } from "./Container";

export function SiteFooter() {
    return (
        <footer className="mt-auto border-t border-gray-100 py-6 md:py-8">
            <Container>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Yuvan. All rights reserved.</p>
                    <p>Physics Lab</p>
                </div>
            </Container>
        </footer>
    );
}
