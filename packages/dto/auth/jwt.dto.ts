export class JwtPayload {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export class JwtResponse {
  accessToken: string;
  refreshToken: string;
  iscompleteProfile: boolean;
  isEmailConfirmed: boolean;
  expAccessToken: number;
  expRefreshToken: number;
}
