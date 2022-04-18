import create from 'zustand';
import { UserResponseDto } from 'dto';

type authStore = {
  isSignedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: UserResponseDto | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserResponseDto) => void;
  setIsSignedIn: (isSignedIn: boolean) => void;
};

export const useAuthStore = create<authStore>((set) => ({
  isSignedIn: true,
  accessToken: null,
  refreshToken: null,
  user: null,
  setTokens(accessToken, refreshToken) {
    set({ accessToken, refreshToken });
  },
  setUser(user) {
    set({ user });
  },
  setIsSignedIn(isSignedIn) {
    set({ isSignedIn });
  },
}));
