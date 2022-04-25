import create from 'zustand';
import { UserResponseDto } from 'dto';

type authStore = {
  isSignedIn: boolean;
  isEmailConfirmed: boolean;
  isCompleteProfile: boolean;
  accessToken: string | null;
  expAccessToken: number | null;
  refreshToken: string | null;
  user: UserResponseDto | null;
  setTokens: (
    accessToken: string,
    expAccessToken: number,
    refreshToken: string,
  ) => void;
  setUser: (user: UserResponseDto) => void;
  setIsSignedIn: (
    isSignedIn: boolean,
    isEmailConfirmed: boolean,
    isCompleteProfile: boolean,
  ) => void;
};

export const useAuthStore = create<authStore>((set) => ({
  isSignedIn: false,
  isEmailConfirmed: false,
  isCompleteProfile: false,
  accessToken: null,
  expAccessToken: null,
  refreshToken: null,
  user: null,
  setTokens(accessToken, expAccessToken, refreshToken) {
    set({ accessToken, expAccessToken, refreshToken });
  },
  setUser(user) {
    set({ user });
  },
  setIsSignedIn(isSignedIn, isEmailConfirmed, isCompleteProfile) {
    set({ isSignedIn, isEmailConfirmed, isCompleteProfile });
  },
}));
