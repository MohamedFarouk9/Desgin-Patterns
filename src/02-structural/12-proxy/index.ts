/**
 * Proxy Pattern — Access Control & Lazy Caching Proxy for Sensitive Reports
 * Controls access (RBAC) and caches expensive report generation without changing the real service.
 */
export interface ReportService {
  getFinancialReport(quarter: string, role: string): Promise<{
    quarter: string;
    revenue: string;
    source: "database" | "proxy-cache";
  }>;
}

class RealReportService implements ReportService {
  async getFinancialReport(quarter: string) {
    await new Promise((r) => setTimeout(r, 30)); // Simulate heavy SQL aggregation
    return { quarter, revenue: "$4,250,000", source: "database" as const };
  }
}

export class ReportAccessProxy implements ReportService {
  private realService: RealReportService | null = null;
  private readonly cache = new Map<string, { quarter: string; revenue: string }>();

  async getFinancialReport(quarter: string, role: string) {
    // 1. Protection Proxy: Enforce Role-Based Access Control
    if (role !== "admin" && role !== "finance") {
      throw new Error(`Access Denied: role "${role}" cannot view financial reports.`);
    }

    // 2. Caching Proxy: Return cached result if available
    const cached = this.cache.get(quarter);
    if (cached) {
      return { ...cached, source: "proxy-cache" as const };
    }

    // 3. Virtual Proxy: Lazy-initialize heavy service only when needed
    if (!this.realService) {
      this.realService = new RealReportService();
    }

    const fresh = await this.realService.getFinancialReport(quarter);
    this.cache.set(quarter, { quarter: fresh.quarter, revenue: fresh.revenue });
    return fresh;
  }
}
