export class JwtPayload {
  _id: string;
  email: string;
}

export class JwtResponse {
  accessToken: string;
  refreshToken: string;
  iscompleteProfile: boolean;
  isEmailConfirmed: boolean;
}
