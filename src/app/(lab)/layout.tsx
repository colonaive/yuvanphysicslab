import LabGuard from "@/components/lab/LabGuard";

export default function LabLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LabGuard>
            {children}
        </LabGuard>
    );
}
