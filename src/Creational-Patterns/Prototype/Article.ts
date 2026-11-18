export interface Cloneable<T> {
  clone(): T;
  deepClone?(): T;
}

export interface DocumentSection {
  heading: string;
  body: string;
  order: number;
}

export interface DocumentMetadata {
  category: string;
  version: number;
  permissions: {
    canEdit: string[];
    canView: string[];
  };
  customFields: Record<string, unknown>;
}

// Concrete Prototype: Campaign Template & Standardized Document
export class CampaignDocumentTemplate implements Cloneable<CampaignDocumentTemplate> {
  public id: string;
  public name: string;
  public themeColor: string;
  public sections: DocumentSection[];
  public metadata: DocumentMetadata;
  public createdAt: Date;

  constructor(
    name: string,
    themeColor: string,
    sections: DocumentSection[],
    metadata: DocumentMetadata
  ) {
    this.id = `tpl_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.name = name;
    this.themeColor = themeColor;
    this.sections = sections;
    this.metadata = metadata;
    this.createdAt = new Date();
  }

  // True Deep Clone: Recursively duplicates nested arrays and objects
  // Prevents reference-sharing bugs where modifying a clone corrupts the master template!
  public clone(): CampaignDocumentTemplate {
    const clonedSections: DocumentSection[] = this.sections.map((section) => ({
      ...section,
    }));

    const clonedMetadata: DocumentMetadata = {
      category: this.metadata.category,
      version: this.metadata.version,
      permissions: {
        canEdit: [...this.metadata.permissions.canEdit],
        canView: [...this.metadata.permissions.canView],
      },
      customFields: JSON.parse(JSON.stringify(this.metadata.customFields)),
    };

    const clonedInstance = new CampaignDocumentTemplate(
      `Copy of ${this.name}`,
      this.themeColor,
      clonedSections,
      clonedMetadata
    );

    return clonedInstance;
  }
}

// Prototype Registry / Cache: In-memory store of heavyweight master prototypes
export class TemplateRegistry {
  private static registry: Map<string, CampaignDocumentTemplate> = new Map();

  public static initializeDefaults(): void {
    const seasonalSaleTemplate = new CampaignDocumentTemplate(
      "Black Friday Campaign Blueprint",
      "#FF0033",
      [
        { heading: "Hero Banner", body: "50% Off Everything this Weekend", order: 1 },
        { heading: "Featured Collection", body: "Hand-picked gadgets and electronics", order: 2 },
        { heading: "Terms & Conditions", body: "Offer valid while stocks last", order: 3 },
      ],
      {
        category: "Marketing",
        version: 1,
        permissions: { canEdit: ["marketing-lead"], canView: ["all-staff"] },
        customFields: { discountPercent: 50, promoCode: "BF50" },
      }
    );

    const productLaunchTemplate = new CampaignDocumentTemplate(
      "Enterprise Product Launch Blueprint",
      "#0066FF",
      [
        { heading: "Executive Summary", body: "Introducing Version 2.0 of our Platform", order: 1 },
        { heading: "Key Features", body: "Scale, Performance, and Security Upgrades", order: 2 },
        { heading: "Call to Action", body: "Book an enterprise demo today", order: 3 },
      ],
      {
        category: "Product",
        version: 1,
        permissions: { canEdit: ["product-manager"], canView: ["all-staff"] },
        customFields: { tier: "Enterprise", sla: "99.99%" },
      }
    );

    this.registry.set("black-friday", seasonalSaleTemplate);
    this.registry.set("product-launch", productLaunchTemplate);
  }

  public static getTemplate(key: string): CampaignDocumentTemplate {
    if (this.registry.size === 0) {
      this.initializeDefaults();
    }

    const template = this.registry.get(key);
    if (!template) {
      throw new Error(`Template prototype with key "${key}" not found in registry.`);
    }

    // Return a clone, preserving the pristine registered prototype
    return template.clone();
  }

  public static registerTemplate(key: string, template: CampaignDocumentTemplate): void {
    this.registry.set(key, template);
  }
}
