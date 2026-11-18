export interface ContentComponent {
  add(child: ContentComponent): void;
  remove(child: ContentComponent): void;
  getChild(index: number): ContentComponent;
  operation(): string;
}

export class Article implements ContentComponent {
  private title: string;
  private content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }

  public add(child: ContentComponent): void {
    throw new Error("Articles are leaf nodes - cannot add children. Use Section instead.");
  }

  public remove(child: ContentComponent): void {
    throw new Error("Articles are leaf nodes - cannot remove children.");
  }

  public getChild(index: number): ContentComponent {
    throw new Error("Articles are leaf nodes - cannot get children.");
  }

  public operation(): string {
    return `Article: "${this.title}" - ${this.content.substring(0, 50)}...`;
  }
}

export class Section implements ContentComponent {
  private title: string;
  private children: ContentComponent[] = [];

  constructor(title: string) {
    this.title = title;
  }

  public add(child: ContentComponent): void {
    this.children.push(child);
  }

  public remove(child: ContentComponent): void {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  public getChild(index: number): ContentComponent {
    return this.children[index] || new Paragraph("Empty section slot");
  }

  public operation(): string {
    const childOperations = this.children.map(child => child.operation()).join("\n  ");
    return `Section: "${this.title}"\n  Children:\n  ${childOperations}`;
  }
}

export class Paragraph implements ContentComponent {
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

  public add(child: ContentComponent): void {
    throw new Error("Cannot add child to a leaf node (Paragraph).");
  }

  public remove(child: ContentComponent): void {
    throw new Error("Cannot remove child from a leaf node (Paragraph).");
  }

  public getChild(index: number): ContentComponent {
    throw new Error("Cannot get child from a leaf node (Paragraph).");
  }

  public operation(): string {
    return `Paragraph: "${this.text.substring(0, 30)}..."`;
  }
}