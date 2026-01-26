import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

const notesDirectory = path.join(process.cwd(), "src/content/notes");

export interface NoteFrontmatter {
    title: string;
    date: string;
    summary: string;
    tags?: string[];
    slug: string;
    readingTime?: string;
}

export async function getNoteBySlug(slug: string) {
    const realSlug = slug.replace(/\.mdx$/, "");
    const filePath = path.join(notesDirectory, `${realSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");

    const { frontmatter, content } = await compileMDX<NoteFrontmatter>({
        source: fileContent,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkMath, remarkGfm],
                rehypePlugins: [rehypeKatex],
            },
        },
    });

    return { meta: { ...frontmatter, slug: realSlug }, content };
}

export async function getAllNotes() {
    if (!fs.existsSync(notesDirectory)) {
        return [];
    }

    const files = fs.readdirSync(notesDirectory);
    const notes = [];

    for (const file of files) {
        if (!file.endsWith(".mdx")) continue;
        const { meta } = (await getNoteBySlug(file)) || {};
        if (meta) {
            notes.push(meta);
        }
    }

    return notes.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}
