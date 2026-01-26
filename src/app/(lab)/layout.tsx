import LabGuard from "@/components/lab/LabGuard";

export default function LabLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isProtected = !!process.env.LAB_PASSCODE;

    return (
        <LabGuard isProtected={isProtected}>
            {children}
        </LabGuard>
    );
}
