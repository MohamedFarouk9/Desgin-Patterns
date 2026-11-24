/**
 * Prototype Pattern — Deep-Cloneable Campaign Blueprint Registry
 * Clones heavy pre-configured templates in memory without shared-reference mutation bugs.
 */
export interface CampaignSection {
  heading: string;
  body: string;
}

export class CampaignTemplate {
  public id: string;
  public name: string;
  public themeColor: string;
  public sections: CampaignSection[];
  public customFields: Record<string, unknown>;

  constructor(
    name: string,
    themeColor: string,
    sections: CampaignSection[],
    customFields: Record<string, unknown>
  ) {
    this.id = `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.name = name;
    this.themeColor = themeColor;
    this.sections = sections;
    this.customFields = customFields;
  }

  public clone(): CampaignTemplate {
    // Deep copy nested arrays and objects so clones never mutate the master template
    const clonedSections = this.sections.map((s) => ({ ...s }));
    const clonedFields = structuredClone(this.customFields);
    return new CampaignTemplate(`Copy of ${this.name}`, this.themeColor, clonedSections, clonedFields);
  }
}

export class TemplateRegistry {
  private static readonly templates = new Map<string, CampaignTemplate>([
    [
      "black-friday",
      new CampaignTemplate(
        "Black Friday Blueprint",
        "#FF0033",
        [
          { heading: "Hero Banner", body: "50% Off Sitewide" },
          { heading: "Terms", body: "Valid while stocks last" },
        ],
        { discountPercent: 50, promoCode: "BF50" }
      ),
    ],
    [
      "product-launch",
      new CampaignTemplate(
        "Enterprise Launch Blueprint",
        "#0066FF",
        [{ heading: "Overview", body: "Introducing v2.0" }],
        { tier: "Enterprise", sla: "99.99%" }
      ),
    ],
  ]);

  public static listKeys(): string[] {
    return Array.from(this.templates.keys());
  }

  public static cloneTemplate(key: string): CampaignTemplate {
    const master = this.templates.get(key);
    if (!master) {
      throw new Error(`Template "${key}" not found. Available: ${this.listKeys().join(", ")}`);
    }
    return master.clone();
  }
}
