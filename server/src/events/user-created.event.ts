export class UserStoredEvent {
  readonly name = 'user.stored';
  readonly username: string;
  readonly token: string;
  readonly since: string;

  constructor(payload: UserStoredEventPayload) {
    this.username = payload.username;
    this.token = payload.token;
    this.since = payload.since;
  }
}

interface UserStoredEventPayload {
  token: string;
  username: string;
  since: string;
}
