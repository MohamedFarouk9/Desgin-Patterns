import { Router, type Request, type Response } from "express";
import { ArticleBuilder, ArticleDirector, type ArticleSEO } from "./index.js";

const router = Router();

router.post("/create", (req: Request, res: Response) => {
  try {
    const { title, content, author, summary, tags, featuredImage, seo, isFeatured, publish, recipe } =
      req.body as {
        title?: string;
        content?: string;
        author?: string;
        summary?: string;
        tags?: string[];
        featuredImage?: string;
        seo?: ArticleSEO;
        isFeatured?: boolean;
        publish?: boolean;
        recipe?: string;
      };

    if (!title || !content || !author) {
      res.status(400).json({ error: "title, content, and author are required." });
      return;
    }

    if (recipe === "breaking-news") {
      const article = ArticleDirector.breakingNews(
        title,
        content,
        author,
        featuredImage ?? "https://cdn.example.com/breaking.jpg"
      );
      res.status(201).json({ pattern: "Builder (Director)", article });
      return;
    }

    const builder = new ArticleBuilder(title, content, author);
    if (summary) builder.setSummary(summary);
    if (Array.isArray(tags)) builder.addTags(tags);
    if (featuredImage) builder.setFeaturedImage(featuredImage);
    if (seo) builder.setSEO(seo);
    if (isFeatured) builder.markFeatured();
    if (publish) builder.publish();

    res.status(201).json({ pattern: "Builder", article: builder.build() });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

export default router;
