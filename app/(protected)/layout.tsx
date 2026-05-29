import React from "react";
import AuthGuard from "./AuthGuard";
import { AppNav } from "@/app/components/AppNav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppNav />
      {/* pt-14: top-nav height on desktop. pb-20: bottom-bar height on mobile. */}
      <div className="min-h-screen md:pt-14 pb-20 md:pb-0">
        {children}
      </div>
    </AuthGuard>
  );
}
