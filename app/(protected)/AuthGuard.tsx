"use client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { useProfileStore } from "@/app/store/useProfileStore";
import { useIdleTimeout } from "@/app/hooks/useIdleTimeout";
import { supabase } from "@/app/utils/supabaseClient";

// Session timeout: 30 minutes of inactivity
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser, user } = useUserStore();
  const { clearProfile, profile, fetchProfile } = useProfileStore();
  const router = useRouter();

  const handleIdle = useCallback(async () => {
    // Sign out on inactivity
    try {
      await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    } catch {
      // Ignore signout errors, still clear local state
    }
    clearUser();
    clearProfile();
    router.replace("/access");
  }, [clearUser, clearProfile, router]);

  // Monitor user inactivity
  useIdleTimeout(handleIdle, SESSION_TIMEOUT_MS);

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        const authUser = data?.user;
        if (error || !authUser) {
          clearUser();
          clearProfile();
          router.replace("/access");
          return;
        }
        setUser(authUser as any);
        await fetchProfile();
      } catch {
        clearUser();
        clearProfile();
        router.replace("/access");
      }
    };
    checkAuthAndProfile();
  }, [router, setUser, clearUser, clearProfile, fetchProfile]);

  // No visual loader here, only render children if user exists
  if (!user || !profile) return null;
  return <>{children}</>;
} 