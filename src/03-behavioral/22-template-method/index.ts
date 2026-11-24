/**
 * Template Method Pattern — Standardized Data Importer Pipeline
 * Defines a fixed skeleton (parse -> validate -> transform -> save) while subclasses customize steps.
 */
export abstract class DataImporter {
  // Template Method (final workflow skeleton)
  public import(rawData: string): { format: string; recordsImported: number; normalized: Record<string, unknown>[] } {
    const parsed = this.parse(rawData);
    this.validate(parsed);
    const normalized = this.transform(parsed);
    return {
      format: this.getFormatName(),
      recordsImported: normalized.length,
      normalized,
    };
  }

  protected abstract getFormatName(): string;
  protected abstract parse(raw: string): Record<string, unknown>[];

  // Shared hook with default validation
  protected validate(rows: Record<string, unknown>[]) {
    if (rows.length === 0) throw new Error("Import failed: dataset is empty.");
  }

  // Shared transformation step
  protected transform(rows: Record<string, unknown>[]) {
    return rows.map((r) => ({ ...r, importedAt: new Date().toISOString() }));
  }
}

export class CsvImporter extends DataImporter {
  protected getFormatName() { return "CSV"; }
  protected parse(raw: string): Record<string, unknown>[] {
    const lines = raw.trim().split("\n").filter(Boolean);
    const [headerLine, ...dataLines] = lines;
    if (!headerLine) return [];
    const headers = headerLine.split(",").map((h) => h.trim());
    return dataLines.map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      return Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? ""]));
    });
  }
}

export class JsonImporter extends DataImporter {
  protected getFormatName() { return "JSON"; }
  protected parse(raw: string): Record<string, unknown>[] {
    const data = JSON.parse(raw) as unknown;
    return Array.isArray(data) ? (data as Record<string, unknown>[]) : [data as Record<string, unknown>];
  }
}
