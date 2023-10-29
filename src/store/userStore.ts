import { User } from "@/gql/graphql";
import { create } from "zustand";
// The Persist middleware enables you to store your Zustand state in a storage
// (e.g., localStorage, AsyncStorage, IndexedDB, etc.), thus persisting its data.
import { persist } from "zustand/middleware";

interface UserState {
  id: number | undefined;
  avatarUrl: string | null;
  fullname: string;
  email?: string;
  updateProfileImage: (image: string) => void;
  updateUsername: (name: string) => void;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: undefined,
      fullname: "",
      email: "",
      avatarUrl: null,

      updateProfileImage: (image: string) => set({ avatarUrl: image }),
      updateUsername: (name: string) => set({ fullname: name }),
      setUser: (user) =>
        set({
          id: user.id || undefined,
          avatarUrl: user.avatarUrl,
          fullname: user.fullname,
          email: user.email,
        }),
    }),
    {
      name: "user-store",
    }
  )
);

/**
 * provided set function with the new state, and it will be shallowly merged
 * with the existing state in the store
 *
 * The set function is to update state in the store., we can skip the ...state part:
 * set((state) => ({ count: state.count + 1 }))
 */
