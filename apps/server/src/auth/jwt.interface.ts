export interface jwtPayload {
  _id: string;
  email: string;
  completeProfile: boolean;
}

export interface jwtResponse {
  accessToken: string;
}
