import type { Request, Response } from "express";

export abstract class APIHandler {
  // Template Method - defines the skeleton
  public handle(request: Request, response: Response): void {
    try {
      this.executeLifecycle(request, response);
    } catch (error) {
      console.error("[APIHandler] Unexpected error in lifecycle:", error);
      response.status(500).json({
        error: "Internal server error",
        status: "error",
      });
    }
  }

  // Template method - calls steps in order
  private executeLifecycle(request: Request, response: Response): void {
    // Step 1: Validate input
    const inputValid = this.validateInput(request);
    if (!inputValid) {
      response.status(400).json({
        error: "Invalid input",
        status: "validation_error",
      });
      return;
    }

    // Step 2: Authenticate
    const authValid = this.authenticate(request);
    if (!authValid) {
      response.status(401).json({
        error: "Unauthorized",
        status: "auth_error",
      });
      return;
    }

    // Step 3: Authorize
    const authzValid = this.authorize(request);
    if (!authzValid) {
      response.status(403).json({
        error: "Forbidden",
        status: "authorization_error",
      });
      return;
    }

    // Step 4: Execute business logic
    const businessResult = this.businessLogic(request);

    // Step 5: Validate business rules
    const rulesValid = this.validateBusinessRules(businessResult);
    if (!rulesValid) {
      response.status(422).json({
        error: "Business rule violation",
        status: "business_rule_error",
        details: businessResult,
      });
      return;
    }

    // Step 6: Format response
    const formattedResponse = this.formatResponse(businessResult);

    // Step 7: Log activity
    this.logActivity(request, businessResult);

    // Step 8: Send success response
    response.status(200).json({
      ...formattedResponse,
      status: "success",
    });
  }

  // Hook methods - can be overridden by subclasses
  protected abstract validateInput(request: Request): boolean;
  protected abstract authenticate(request: Request): boolean;
  protected abstract authorize(request: Request): boolean;
  protected abstract businessLogic(request: Request): any;

  protected validateBusinessRules(result: any): boolean {
    return true;
  }

  protected formatResponse(result: any): any {
    return { data: result };
  }

  protected logActivity(request: Request, result: any): void {
    console.log(`[APIHandler] ${request.method} ${request.path} - success`);
  }
}