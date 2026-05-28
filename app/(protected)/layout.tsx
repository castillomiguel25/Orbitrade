import React from "react";
import AuthGuard from "./AuthGuard";
import { SidebarNav } from "@/app/components/SidebarNav";

// This layout wraps all protected routes with the PLASMINE sidebar navigation

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex">
        {/* Sidebar Navigation */}
        <SidebarNav />

        {/* Main Content Area - with left margin to account for sidebar */}
        <main className="flex-1 md:ml-20 lg:ml-[280px] transition-all duration-500">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
} 