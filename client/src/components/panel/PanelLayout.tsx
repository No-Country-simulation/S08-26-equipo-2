import { Outlet } from "react-router-dom";
import { Sidebar } from "./SideBar";

export function PanelLayout() {
  return (
    <div >
      <Sidebar />
      <main className="ml-[320px] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}