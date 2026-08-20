import { create } from 'zustand';
import type { Profile } from '../types/profile';
import { toast } from './toastStore';
import { apiClient } from '../api/apiClient'; // CHANGE ONLY THIS IMPORT IF YOUR EXISTING apiClient LIVES ELSEWHERE

export interface ProfileUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
}

interface ProfileStore {
  profile: Profile | null;
  loading: boolean;
  mutating: boolean;

  getProfileDetails: () => Promise<Profile | null>;
  updateProfileApi: (payload: ProfileUpdatePayload) => Promise<Profile | null>;
  clearProfile: () => void;
}

const getErrorMessage = (error: unknown): string => {
  const value = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return value.response?.data?.message ?? value.response?.data?.error ?? value.message ?? 'Something went wrong';
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  loading: false,
  mutating: false,

  getProfileDetails: async () => {
    set({ loading: true });

    try {
      const data = await apiClient.get<Profile>('/auth/profile');
      set({ profile: data });
      return data;
    } catch (error) {
      toast(getErrorMessage(error), 'error');
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateProfileApi: async (payload) => {
    const { getProfileDetails } = get();
    set({ mutating: true });

    try {
      const data = await apiClient.put<Profile>('/auth/profile', {
        fullName: payload?.name, email: payload?.email, mobileNumber: payload?.phone,
      });
      set((state) => ({ profile: { ...state.profile, ...data } }));
      toast('Profile updated successfully', 'success');
      getProfileDetails();
      return data;
    } catch (error) {
      toast(getErrorMessage(error), 'error');
      return null;
    } finally {
      set({ mutating: false });
    }
  },

  clearProfile: () => set({ profile: null }),
}));