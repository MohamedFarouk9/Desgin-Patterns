import { Router, type Request, type Response } from "express";
import { ArticleBuilder, ArticleDirector } from "../Creational-Patterns/Builder/ArticleBuilder.js";

const router = Router();

router.post("/create", (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      author,
      summary,
      tags,
      featuredImage,
      galleryImages,
      seo,
      isFeatured,
      publish,
      recipe,
    } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: "title, content, and author are required." });
    }

    // Check if Director recipe was requested
    if (recipe === "news-breaking") {
      const article = ArticleDirector.constructNewsBreakingPost(
        title,
        content,
        author,
        featuredImage || "https://cdn.example.com/breaking-news.jpg"
      );
      return res.status(201).json({
        message: "✅ Article assembled via ArticleDirector (Breaking News Recipe)!",
        article,
      });
    }

    if (recipe === "seo-optimized") {
      const article = ArticleDirector.constructSEOOptimizedPost(
        title,
        content,
        author,
        summary || "Default summary",
        tags || ["general", "insights"]
      );
      return res.status(201).json({
        message: "✅ Article assembled via ArticleDirector (SEO Recipe)!",
        article,
      });
    }

    // Standard Fluent Builder usage
    const builder = new ArticleBuilder(title, content, author);

    if (summary) builder.setSummary(summary);
    if (tags && Array.isArray(tags)) builder.addTags(tags);
    if (featuredImage) builder.setFeaturedImage(featuredImage);
    if (galleryImages && Array.isArray(galleryImages)) builder.addGalleryImages(galleryImages);
    if (seo) builder.setSEO(seo);
    if (isFeatured) builder.markAsFeatured();
    if (publish) builder.publish();

    const article = builder.build();

    return res.status(201).json({
      message: "✅ Article created successfully using Fluent Builder Pattern!",
      article,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(400).json({ error: message });
  }
});

export default router;
