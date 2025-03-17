export class UserCreatedEvent {
  public readonly name = 'user.login';
  public readonly username: string;
  public readonly token: string;

  constructor(token: string, username: string) {
    this.username = username
    this.token = token
  }
}
