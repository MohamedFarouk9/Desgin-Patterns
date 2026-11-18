export class UserService {
  public users: string[] = [];

  public createUser(name: string): void {
    this.users.push(name);
    console.log(`[UserService] Created user: ${name}`);
  }

  public deleteUser(name: string): void {
    const index = this.users.indexOf(name);
    if (index > -1) {
      this.users.splice(index, 1);
    }
    console.log(`[UserService] Deleted user: ${name}`);
  }

  public getUsers(): string[] {
    return this.users;
  }

  public setUsers(users: string[]): void {
    this.users = users;
  }
}