import create from 'zustand';
import { UserResponseDto } from 'dto';

type authStore = {
  isSignedIn: boolean;
  isEmailConfirmed: boolean;
  isCompleteProfile: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: UserResponseDto | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
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
  refreshToken: null,
  user: null,
  setTokens(accessToken, refreshToken) {
    set({ accessToken, refreshToken });
  },
  setUser(user) {
    set({ user });
  },
  setIsSignedIn(isSignedIn, isEmailConfirmed, isCompleteProfile) {
    set({ isSignedIn, isEmailConfirmed, isCompleteProfile });
  },
}));
