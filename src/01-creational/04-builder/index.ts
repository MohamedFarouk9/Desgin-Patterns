/**
 * Builder Pattern — Complex CMS Article & SEO Aggregate
 * Replaces telescoping constructors with fluent step-by-step construction and Director recipes.
 */
export interface ArticleSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  summary?: string | undefined;
  tags: string[];
  featuredImage?: string | undefined;
  seo?: ArticleSEO | undefined;
  status: "draft" | "published";
  isFeatured: boolean;
  readingTimeMinutes: number;
  publishedAt?: string | undefined;
}

export class ArticleBuilder {
  private article: Article;

  constructor(title: string, content: string, author: string) {
    if (!title || !content || !author) {
      throw new Error("title, content, and author are mandatory.");
    }
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
    const readingTimeMinutes = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

    this.article = {
      id: `art_${Date.now()}`,
      title,
      slug,
      content,
      author,
      tags: [],
      status: "draft",
      isFeatured: false,
      readingTimeMinutes,
    };
  }

  public setSummary(summary: string): this {
    this.article.summary = summary;
    return this;
  }

  public addTags(tags: string[]): this {
    this.article.tags = Array.from(new Set([...this.article.tags, ...tags]));
    return this;
  }

  public setFeaturedImage(url: string): this {
    this.article.featuredImage = url;
    return this;
  }

  public setSEO(seo: ArticleSEO): this {
    this.article.seo = seo;
    return this;
  }

  public markFeatured(): this {
    this.article.isFeatured = true;
    return this;
  }

  public publish(): this {
    this.article.status = "published";
    this.article.publishedAt = new Date().toISOString();
    return this;
  }

  public build(): Article {
    return { ...this.article };
  }
}

export class ArticleDirector {
  static breakingNews(title: string, content: string, author: string, image: string): Article {
    return new ArticleBuilder(title, content, author)
      .setFeaturedImage(image)
      .addTags(["breaking", "news"])
      .markFeatured()
      .publish()
      .build();
  }
}
