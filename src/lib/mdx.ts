import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

const rootContentDir = path.join(process.cwd(), "src/content");

export type ContentType = "notes" | "research";

export interface Frontmatter {
    title: string;
    date: string;
    summary: string;
    tags?: string[];
    slug: string;
    status?: "public" | "private";
    readingTime?: string;
    type?: ContentType; // Injected during load
}

export async function getContentBySlug(type: ContentType, slug: string) {
    const realSlug = slug.replace(/\.mdx$/, "");
    const filePath = path.join(rootContentDir, type, `${realSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");

    const { frontmatter, content } = await compileMDX<Frontmatter>({
        source: fileContent,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkMath, remarkGfm],
                rehypePlugins: [rehypeKatex],
            },
        },
    });

    return {
        meta: {
            ...frontmatter,
            slug: realSlug,
            type
        },
        content
    };
}

export async function getAllContent(type: ContentType) {
    const dir = path.join(rootContentDir, type);

    if (!fs.existsSync(dir)) {
        return [];
    }

    const files = fs.readdirSync(dir);
    const items = [];

    for (const file of files) {
        if (!file.endsWith(".mdx")) continue;
        const { meta } = (await getContentBySlug(type, file)) || {};
        if (meta && meta.status !== "private") {
            items.push(meta);
        }
    }

    return items.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export async function getRecentContent() {
    const notes = await getAllContent("notes");
    const research = await getAllContent("research");

    const all = [...notes, ...research];

    return all
        .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))
        .slice(0, 3);
}
