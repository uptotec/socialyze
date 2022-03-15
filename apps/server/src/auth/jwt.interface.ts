export interface jwtPayload {
  _id: string;
  email: string;
}

export interface jwtResponse {
  accessToken: string;
}
