import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar/Sidebar";
import ProtectedRoutes from "../components/ProtectedRoutes/ProtectedRoutes";
import AuthOverlay from "../components/AuthOverlay/AuthOverlay";
import { Overlay } from "@mantine/core";

export function HomePage() {
  return (
    <MainLayout>
      <>
        <Sidebar />
        <AuthOverlay />
        Home
      </>
    </MainLayout>
  );
}
