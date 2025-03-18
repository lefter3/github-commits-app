export class TokenPayload {
  username: string;
  token: string;
  displayName: string;
}

export class AuthRequest extends Request {
  user: TokenPayload;
}
