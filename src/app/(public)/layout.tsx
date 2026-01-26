import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SiteHeader />
            <main className="flex-1 py-8 md:py-12">{children}</main>
            <SiteFooter />
        </>
    );
}
