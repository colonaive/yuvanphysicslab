"use client";

import Markdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";

interface MdxRendererProps {
  content: string;
  className?: string;
}

export function MdxRenderer({ content, className }: MdxRendererProps) {
  return (
    <div className={cn("prose-lab", className)}>
      <Markdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
        {content}
      </Markdown>
    </div>
  );
}
