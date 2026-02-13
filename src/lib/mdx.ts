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
    description?: string;
    abstract?: string;
    pdfUrl?: string;
    tags?: string[];
    slug: string;
    status?: "public" | "published" | "private" | "draft";
    readingTime?: string;
    type?: ContentType; // Injected during load
}

export interface UnifiedPostMeta extends Frontmatter {
    type: ContentType;
}

function dedupeByKey<T>(items: T[], getKey: (item: T) => string) {
    const seen = new Set<string>();
    return items.filter((item) => {
        const key = getKey(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function dedupeByTitle<T extends { title: string }>(items: T[]) {
    return dedupeByKey(items, (item) => item.title.trim().toLowerCase());
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
    const isProd = process.env.NODE_ENV === "production";

    for (const file of files) {
        if (!file.endsWith(".mdx")) continue;
        const { meta } = (await getContentBySlug(type, file)) || {};

        if (!meta) continue;

        // Strict filtering:
        // 1. Never show "private"
        // 2. Hide "draft" in production
        if (meta.status === "private") continue;
        if (isProd && meta.status === "draft") continue;

        items.push(meta);
    }

    const sorted = items.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
    return dedupeByKey(sorted, (item) => item.slug);
}

export async function getRecentContent() {
    // Note: getAllContent already filters private/draft
    const notes = await getAllContent("notes");
    const research = await getAllContent("research");

    const all = dedupeByKey([...notes, ...research], (item) => `${item.type}:${item.slug}`);

    return dedupeByTitle(all)
        .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))
        .slice(0, 3);
}

export async function getAllPosts(): Promise<UnifiedPostMeta[]> {
    const notes = await getAllContent("notes");
    const research = await getAllContent("research");
    return dedupeByKey([...research, ...notes], (item) => `${item.type}:${item.slug}`).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ) as UnifiedPostMeta[];
}

export async function getPostBySlug(slug: string) {
    const researchPost = await getContentBySlug("research", slug);
    if (researchPost?.meta) return researchPost;

    const notePost = await getContentBySlug("notes", slug);
    if (notePost?.meta) return notePost;

    return null;
}
