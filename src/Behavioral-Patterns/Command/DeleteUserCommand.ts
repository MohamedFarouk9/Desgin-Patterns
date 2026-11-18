import { Command } from "./Command.js";
import { UserService } from "./UserService.js";

export class DeleteUserCommand implements Command {
  private userService: UserService;
  private name: string;
  private deletedUser: string | null = null;

  constructor(userService: UserService, name: string) {
    this.userService = userService;
    this.name = name;
  }

  public execute(): void {
    this.deletedUser = this.userService.users.find((u: string) => u === this.name) || null;
    this.userService.deleteUser(this.name);
    console.log(`[DeleteUserCommand] Executed: deleted ${this.name}`);
  }

  public undo(): void {
    // Restore the deleted user
    if (this.deletedUser) {
      this.userService.users.push(this.deletedUser);
      console.log(`[DeleteUserCommand] Undone: restored ${this.deletedUser}`);
    }
  }
}