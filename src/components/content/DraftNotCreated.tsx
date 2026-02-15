import { Card } from "@/components/ui/Card";

interface DraftNotCreatedProps {
  slug: string;
  tableName: "public_pages" | "public_posts";
}

export function DraftNotCreated({ slug, tableName }: DraftNotCreatedProps) {
  return (
    <Card className="p-5 text-sm text-muted">
      Draft not created for <code>{slug}</code> in <code>{tableName}</code>.
    </Card>
  );
}
