import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Sidebar } from "./SideBar";
import { Video } from "lucide-react";

export function PanelLayout() {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={{ "--sidebar-width": "240px" } as React.CSSProperties}
    >
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <SidebarInset className="flex flex-1 flex-col min-w-0 bg-background">
          {/* Mobile Top Header */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/70 px-4 md:hidden backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 text-slate-300 hover:text-white" />
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  }}
                >
                  <Video className="w-3.5 h-3.5 text-white" />
                </div>
                <span
                  className="text-base font-bold tracking-tight"
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    background: "linear-gradient(135deg, #fff, #93c5fd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  MeetFlow
                </span>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default PanelLayout;