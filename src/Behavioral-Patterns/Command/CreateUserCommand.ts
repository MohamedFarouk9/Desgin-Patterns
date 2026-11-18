import { Command } from "./Command.js";
import { UserService } from "./UserService.js";

export class CreateUserCommand implements Command {
  private userService: UserService;
  private name: string;
  private previousState: string[] = [];

  constructor(userService: UserService, name: string) {
    this.userService = userService;
    this.name = name;
  }

  public execute(): void {
    // Capture state before execution (for undo)
    this.previousState = [...this.userService.getUsers()];

    this.userService.createUser(this.name);
    console.log(`[CreateUserCommand] Executed: ${this.name}`);
  }

  public undo(): void {
    // Restore previous state
    this.userService.users = [...this.previousState];
    console.log(`[CreateUserCommand] Undone: ${this.name} removed, state restored to: ${this.previousState.join(', ')}`);
  }
}