import Link from "next/link";
import { PenTool, Notebook, ArrowRight } from "lucide-react";

export default function LabDashboard() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-2">Lab Dashboard</h1>
                <p className="text-gray-500">Private workspace.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/lab/latex" className="group block">
                    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <PenTool className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Latex Scratchpad</h2>
                        <p className="text-gray-600 text-sm">
                            iPad-friendly editor with split view, symbol palette, and autosave.
                        </p>
                    </div>
                </Link>

                {/* Placeholder for future tools */}
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed h-full flex flex-col justify-center items-center text-center">
                    <div className="p-3 bg-gray-100 text-gray-400 rounded-lg mb-4">
                        <Notebook className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-medium text-gray-500 mb-1">More Tools Soon</h2>
                    <p className="text-gray-400 text-xs">Jupyter integration coming later.</p>
                </div>
            </div>
        </div>
    );
}
