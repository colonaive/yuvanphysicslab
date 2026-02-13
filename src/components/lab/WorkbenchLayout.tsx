
import { cn } from "@/lib/utils";
import { semanticClasses } from "@/theme/tokens";

interface WorkbenchLayoutProps {
    researchPane: React.ReactNode;
    editorPane: React.ReactNode;
    feedbackPane: React.ReactNode;
}

export function WorkbenchLayout({ researchPane, editorPane, feedbackPane }: WorkbenchLayoutProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[calc(100vh-12rem)]">
            {/* Research Pane - Left */}
            <div className="lg:col-span-3 h-full overflow-hidden flex flex-col">
                <div className={cn(semanticClasses.cardMuted, "flex-1 overflow-y-auto p-4")}>
                    {researchPane}
                </div>
            </div>

            {/* Editor Pane - Middle */}
            <div className="lg:col-span-6 h-full flex flex-col">
                <div className={cn(semanticClasses.card, "flex-1 flex flex-col")}>
                    {editorPane}
                </div>
            </div>

            {/* Feedback Pane - Right */}
            <div className="lg:col-span-3 h-full overflow-hidden flex flex-col">
                <div className={cn(semanticClasses.cardMuted, "flex-1 overflow-y-auto p-4")}>
                    {feedbackPane}
                </div>
            </div>
        </div>
    );
}
