import { verifyLabAuth } from "@/lib/auth";
import { LabLogin } from "@/components/lab/LabLogin";
import { LabDashboard } from "@/components/lab/LabDashboard";
import { Container } from "@/components/site/Container";

export default async function LabPage() {
    const isAuthed = await verifyLabAuth();

    return (
        <Container className="py-12">
            {isAuthed ? <LabDashboard /> : <LabLogin />}
        </Container>
    );
}
