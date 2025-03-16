export class TokenPayload {
  username: string;
  ghToken: string;
  displayName: string;
}

export class AuthRequest extends Request {
  user: TokenPayload;
}
