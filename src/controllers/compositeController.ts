import { Router, type Request, type Response } from "express";
import { Article, Section, Paragraph } from "../Structural-Patterns/Composite/ContentComponent.js";

const router = Router();

router.post("/create-article", (req: Request, res: Response) => {
  try {
    const { title, content, sections } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required." });
    }

    // Create root article
    const rootArticle = new Article(title, content);

    // Add sections if provided
    if (sections && Array.isArray(sections)) {
      sections.forEach((sectionData: any) => {
        const newSection = new Section(sectionData.title);

        if (sectionData.paragraphs && Array.isArray(sectionData.paragraphs)) {
          sectionData.paragraphs.forEach((p: string) => {
            newSection.add(new Paragraph(p));
          });
        }

        rootArticle.add(newSection);
      });
    }

    // Uniform operation - validate all content
    const result = rootArticle.operation();

    return res.status(201).json({
      message: "✅ Composite content structure created successfully",
      structure: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(400).json({ error: message });
  }
});

router.get("/operation", (req: Request, res: Response) => {
  try {
    const { title, content, sections } = req.query;

    // Quick demo - create minimal structure
    const article = new Article(title as string || "Demo", content as string || "Demo content");

    if (sections) {
      (sections as string[]).forEach((secTitle: string) => {
        const newSection = new Section(secTitle);
        newSection.add(new Paragraph(`Paragraph in ${secTitle}`));
        article.add(newSection);
      });
    }

    const result = article.operation();

    return res.status(200).json({
      message: "Composite operation result",
      structure: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(500).json({ error: message });
  }
});

export default router;