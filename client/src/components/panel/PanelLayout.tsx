import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Sidebar } from "./SideBar";
import { Header } from "./Header";

export function PanelLayout() {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={{ "--sidebar-width": "240px" } as React.CSSProperties}
      className="h-screen overflow-hidden"
    >
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar />
        <SidebarInset className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden bg-background">
          {/* Top Navigation Header */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto min-h-0">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default PanelLayout;