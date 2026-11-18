export interface ArticleSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
}

export interface ArticleAuditLog {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy?: string;
  lastModifiedAt?: Date;
  status: "draft" | "review" | "published" | "archived";
}

export interface ArticleEntity {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  author: string;
  tags: string[];
  featuredImage?: string;
  galleryImages: string[];
  seo?: ArticleSEO;
  audit: ArticleAuditLog;
  publishedAt?: Date;
  isFeatured: boolean;
  readingTimeMinutes: number;
}

// Fluent Builder Interface
export interface IArticleBuilder {
  setSummary(summary: string): this;
  addTags(tags: string[]): this;
  setFeaturedImage(url: string): this;
  addGalleryImages(urls: string[]): this;
  setSEO(seo: ArticleSEO): this;
  markAsFeatured(): this;
  publish(): this;
  build(): ArticleEntity;
}

// Concrete Builder
export class ArticleBuilder implements IArticleBuilder {
  private article: Partial<ArticleEntity>;

  constructor(title: string, content: string, author: string) {
    if (!title || !content || !author) {
      throw new Error("Article initialization requires mandatory fields: title, content, author.");
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    this.article = {
      id: `art_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      title,
      slug,
      content,
      author,
      tags: [],
      galleryImages: [],
      isFeatured: false,
      readingTimeMinutes: readingTime,
      audit: {
        createdBy: author,
        createdAt: new Date(),
        status: "draft",
      },
    };
  }

  public setSummary(summary: string): this {
    this.article.summary = summary;
    return this;
  }

  public addTags(tags: string[]): this {
    if (this.article.tags) {
      this.article.tags = Array.from(new Set([...this.article.tags, ...tags]));
    }
    return this;
  }

  public setFeaturedImage(url: string): this {
    this.article.featuredImage = url;
    return this;
  }

  public addGalleryImages(urls: string[]): this {
    if (this.article.galleryImages) {
      this.article.galleryImages.push(...urls);
    }
    return this;
  }

  public setSEO(seo: ArticleSEO): this {
    this.article.seo = seo;
    return this;
  }

  public markAsFeatured(): this {
    this.article.isFeatured = true;
    return this;
  }

  public publish(): this {
    if (this.article.audit) {
      this.article.audit.status = "published";
    }
    this.article.publishedAt = new Date();
    return this;
  }

  public build(): ArticleEntity {
    // Validation before returning immutable product
    if (!this.article.title || !this.article.content) {
      throw new Error("Cannot build incomplete Article: title or content missing.");
    }
    return this.article as ArticleEntity;
  }
}

// Director (Optional Helper): Encapsulates standardized construction recipes
export class ArticleDirector {
  public static constructNewsBreakingPost(
    title: string,
    content: string,
    author: string,
    imageUrl: string
  ): ArticleEntity {
    return new ArticleBuilder(title, content, author)
      .setFeaturedImage(imageUrl)
      .addTags(["news", "breaking", "hot"])
      .markAsFeatured()
      .publish()
      .build();
  }

  public static constructSEOOptimizedPost(
    title: string,
    content: string,
    author: string,
    summary: string,
    keywords: string[]
  ): ArticleEntity {
    return new ArticleBuilder(title, content, author)
      .setSummary(summary)
      .addTags(keywords)
      .setSEO({
        metaTitle: `${title} | Tech Insights`,
        metaDescription: summary.substring(0, 160),
        keywords,
      })
      .build();
  }
}
