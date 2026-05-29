import { create } from 'zustand';
import { genConfig } from "react-nice-avatar";

export type Profile = {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatarconfig?: string;
  dailyearnings?: number;
  decount_deposits?: number;
  frozenbalance?: number;
  hasinvested?: boolean | null;
  lastupdate?: string;
  plan_1?: string | null;
  plan_2?: string | null;
  plan_3?: string | null;
  planstartdate?: string | null;
  referralcode?: string;
  referralrewards?: number | null;
  referredby?: string | null;
  role?: string;
  totalgenerated?: number;
  trc20_wallet?: string | null;
  trc20addresswithdrawal?: string | null;
  trc20balance?: number;
  wallet?: string | null;
  withdrawalkey?: string | null;
  withdrawals_amount?: number;
  flujo?: number;
  // ...agrega todos los campos que necesites
} | null;

interface ProfileState {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
  fetchProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
  fetchProfile: async () => {
    try {
      const profileRes = await fetch("/api/profiles", { cache: 'no-store' });
      const result = await profileRes.json();
      const profileValue = result.profiles?.[0];
      if (profileValue) {
        const avatarConfigFromDB = profileValue.avatarconfig
          ? JSON.parse(profileValue.avatarconfig)
          : genConfig(profileValue.email);
        const avatarUrl = "/api/avatar?" + new URLSearchParams(avatarConfigFromDB);
        set({
          profile: {
            ...profileValue,
            name: profileValue.name || "",
            email: profileValue.email || "",
            avatarUrl: avatarUrl,
            avatarconfig: profileValue.avatarconfig,
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
}));