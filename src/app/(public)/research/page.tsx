import { Container } from "@/components/site/Container";
import fs from "fs";
import path from "path";

// Define type for research item
interface ResearchItem {
    slug: string;
    title: string;
    summary: string;
    key_terms: string[];
    status: string;
    what_im_working_on: string[];
}

async function getResearchDirections() {
    const filePath = path.join(process.cwd(), "src/content/research/directions.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent) as ResearchItem[];
}

export default async function ResearchPage() {
    const directions = await getResearchDirections();

    return (
        <Container>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Research Directions</h1>
                    <p className="text-gray-500">Current topics I am investigating.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-1">
                    {directions.map((item) => (
                        <div key={item.slug} className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h2>
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                    {item.status}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-4">{item.summary}</p>

                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">What I'm working on:</h3>
                                <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                                    {item.what_im_working_on.map((task, i) => (
                                        <li key={i}>{task}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
                                {item.key_terms.map((term) => (
                                    <span key={term} className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                        # {term}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
}
